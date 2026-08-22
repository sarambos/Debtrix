import {PutObjectCommand, S3Client,} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import * as Crypto from "expo-crypto";
import type { ImagePickerAsset } from "expo-image-picker";

import { environment } from "../config/environment";
import type { ScannedReceipt } from "../types/receipt";

type ScanStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

type ReceiptScanJob = {
  jobId: string;
  status: ScanStatus;
  result?: ScannedReceipt;
  message?: string;
};

const s3 = new S3Client({
  region: environment.awsRegion,
  credentials: fromCognitoIdentityPool({
    identityPoolId:
      environment.cognitoIdentityPoolId,
    clientConfig: {
      region: environment.awsRegion,
    },
  }),
});

function imageMetadata(asset: ImagePickerAsset) {
  const mimeType =
    asset.mimeType?.toLowerCase() ?? "";
  const fileName = (
    asset.fileName ??
    asset.uri
  ).toLowerCase();

  if (
    mimeType === "image/png" ||
    fileName.endsWith(".png")
  ) {
    return {
      contentType: "image/png",
      extension: "png",
    };
  }

  if (
    mimeType === "image/jpeg" ||
    mimeType === "image/jpg" ||
    fileName.endsWith(".jpg") ||
    fileName.endsWith(".jpeg")
  ) {
    return {
      contentType: "image/jpeg",
      extension: "jpg",
    };
  }

  throw new Error(
    "Choose a JPEG or PNG receipt image.",
  );
}

function delay(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function retrieveScanJob(
  jobId: string,
): Promise<ReceiptScanJob> {
  const response = await fetch(
    `${environment.apiURL}/receipt-scans/${encodeURIComponent(jobId)}`,
  );

  if (!response.ok) {
    throw new Error(
      "Unable to retrieve the receipt scan.",
    );
  }

  return (await response.json()) as ReceiptScanJob;
}

async function waitForScan(
  jobId: string,
): Promise<ScannedReceipt> {
  const maximumAttempts = 40;

  for (
    let attempt = 0;
    attempt < maximumAttempts;
    attempt += 1
  ) {
    const job = await retrieveScanJob(jobId);

    if (job.status === "COMPLETED") {
      if (!job.result) {
        throw new Error(
          "The completed scan did not contain a result.",
        );
      }

      return job.result;
    }

    if (job.status === "FAILED") {
      throw new Error(
        job.message ??
          "The receipt could not be processed.",
      );
    }

    await delay(1500);
  }

  throw new Error(
    "Receipt scanning is taking longer than expected. Try again shortly.",
  );
}

export async function uploadAndScanReceipt(
  asset: ImagePickerAsset,
): Promise<ScannedReceipt> {
  const metadata = imageMetadata(asset);

  const localResponse = await fetch(asset.uri);

  if (!localResponse.ok) {
    throw new Error(
      "The selected receipt image could not be read.",
    );
  }

  const imageBuffer =
    await localResponse.arrayBuffer();

  const imageBytes = new Uint8Array(imageBuffer);

  const maximumSize = 10 * 1024 * 1024;

  if (imageBytes.byteLength > maximumSize) {
    throw new Error(
      "The receipt image must be smaller than 10 MB.",
    );
  }

  const jobId = Crypto.randomUUID();
  const objectKey =
    `receipts/incoming/${jobId}.${metadata.extension}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: environment.receiptBucket,
      Key: objectKey,
      Body: imageBytes,
      ContentType: metadata.contentType,
    }),
  );

  return waitForScan(jobId);
}