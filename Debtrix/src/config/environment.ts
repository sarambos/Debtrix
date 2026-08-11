function required(
  name: string,
  value: string | undefined,
) {
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

export const environment = {
  apiURL: required(
    "EXPO_PUBLIC_API_URL",
    process.env.EXPO_PUBLIC_API_URL,
  ).replace(/\/$/, ""),

  awsRegion:
    process.env.EXPO_PUBLIC_AWS_REGION ??
    "us-east-1",

  receiptBucket: required(
    "EXPO_PUBLIC_RECEIPT_BUCKET",
    process.env.EXPO_PUBLIC_RECEIPT_BUCKET,
  ),

  cognitoIdentityPoolId: required(
    "EXPO_PUBLIC_COGNITO_IDENTITY_POOL_ID",
    process.env
      .EXPO_PUBLIC_COGNITO_IDENTITY_POOL_ID,
  ),
};