import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import type {
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

const documentClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({}),
);

function response(
  statusCode: number,
  body: unknown,
): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "content-type",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
    },
    body: JSON.stringify(body),
  };
}

export const handler: APIGatewayProxyHandlerV2 =
  async (event) => {
    try {
      const tableName =
        process.env.RECEIPT_SCAN_JOBS_TABLE_NAME;
      const jobId = event.pathParameters?.jobId;

      if (!tableName) {
        throw new Error(
          "RECEIPT_SCAN_JOBS_TABLE_NAME is not configured.",
        );
      }

      if (
        !jobId ||
        !/^[0-9a-f-]{36}$/i.test(jobId)
      ) {
        return response(400, {
          message: "A valid scan job ID is required.",
        });
      }

      const result = await documentClient.send(
        new GetCommand({
          TableName: tableName,
          Key: { jobId },
        }),
      );

      // The S3 event might not have created the job yet.
      if (!result.Item) {
        return response(200, {
          jobId,
          status: "PENDING",
        });
      }

      return response(200, result.Item);
    } catch (error) {
      console.error(
        "Unable to retrieve receipt scan:",
        error,
      );

      return response(500, {
        message:
          "Unable to retrieve the receipt scan.",
      });
    }
  };