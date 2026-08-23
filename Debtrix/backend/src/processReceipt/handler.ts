import {
  AnalyzeExpenseCommand,
  TextractClient,
} from "@aws-sdk/client-textract";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type { S3Event, S3EventRecord } from "aws-lambda";
import { processReceipt } from "./processReceipt";

const textract = new TextractClient({});

const documentClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({}),
  {
    marshallOptions: {
      removeUndefinedValues: true,
    },
  },
);

function objectKeyFromRecord(record: S3EventRecord) {
  return decodeURIComponent(
    record.s3.object.key.replace(/\+/g, " "),
  );
}

function jobIdFromObjectKey(objectKey: string) {
  const fileName = objectKey.split("/").pop() ?? "";

  return fileName.replace(/\.[^.]+$/, "");
}

async function processRecord(record: S3EventRecord) {
  const tableName =
    process.env.RECEIPT_SCAN_JOBS_TABLE_NAME;

  if (!tableName) {
    throw new Error(
      "RECEIPT_SCAN_JOBS_TABLE_NAME is not configured.",
    );
  }

  const bucket = record.s3.bucket.name;
  const objectKey = objectKeyFromRecord(record);
  const jobId = jobIdFromObjectKey(objectKey);

  if (
    !objectKey.startsWith("receipts/incoming/") ||
    !jobId
  ) {
    console.warn(
      "Ignoring unexpected S3 object:",
      objectKey,
    );
    return;
  }

  const existing = await documentClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { jobId },
    }),
  );

  if (existing.Item?.status === "COMPLETED") {
    console.log("Scan already completed:", jobId);
    return;
  }

  const now = new Date().toISOString();
  const createdAt =
    typeof existing.Item?.createdAt === "string"
      ? existing.Item.createdAt
      : now;

  await documentClient.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        jobId,
        status: "PROCESSING",
        bucket,
        objectKey,
        createdAt,
        updatedAt: now,
        expiresAt:
          Math.floor(Date.now() / 1000) +
          24 * 60 * 60,
      },
    }),
  );

  try {
    const textractResponse = await textract.send(
      new AnalyzeExpenseCommand({
        Document: {
          S3Object: {
            Bucket: bucket,
            Name: objectKey,
          },
        },
      }),
    );

    const expenseDocument =
      textractResponse.ExpenseDocuments?.[0];

    console.log(
      "TEXTRACT EXPENSE DOCUMENT:",
      JSON.stringify(expenseDocument, null, 2),
    );

    const result = processReceipt(expenseDocument);

    console.log(
      "PARSED RECEIPT RESULT:",
      JSON.stringify(result, null, 2),
    );

    await documentClient.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { jobId },
        UpdateExpression:
          "SET #status = :status, #result = :result, updatedAt = :updatedAt REMOVE #message",
        ExpressionAttributeNames: {
          "#status": "status",
          "#result": "result",
          "#message": "message",
        },
        ExpressionAttributeValues: {
          ":status": "COMPLETED",
          ":result": result,
          ":updatedAt": new Date().toISOString(),
        },
      }),
    );
  } catch (error) {
    console.error(
      "Receipt processing failed:",
      jobId,
      error,
    );

    await documentClient.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { jobId },
        UpdateExpression:
          "SET #status = :status, #message = :message, updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#status": "status",
          "#message": "message",
        },
        ExpressionAttributeValues: {
          ":status": "FAILED",
          ":message":
            "The receipt could not be processed.",
          ":updatedAt": new Date().toISOString(),
        },
      }),
    );
  }
}

export async function handler(event: S3Event) {
  for (const record of event.Records) {
    await processRecord(record);
  }
}
