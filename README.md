# Debtrix

Debtrix is an expense-splitting app built with Expo and React Native. It lets a group enter or scan a receipt, assign individual items to one or more people, and calculate each person's share of the items, tax, and tip. 
The app includes an AWS backend for receipt processing, split calculation, and receipt history. 

## Features

- Create an expense with any number of participants and receipt items.
- Assign each item to one person or split it among several people.
- Estimate tax using a selected U.S. state rate.
- Add a preset or custom tip.
- Split tax and tip proportionally according to each person's item subtotal.
- Scan JPEG or PNG receipt photos with Amazon Textract.
- Review a detailed per-person split report.
- Browse previously calculated receipts.
- Switch between light and dark themes.
- Run on Android, iOS, and the web through Expo.

<!--- ## Demo --->


## Tech stack 

### Frontend / App
- Expo 55
- React 19
- React Native 0.83
- Expo Router
- TypeScript
- AWS SDK for JavaScript

### Backend / Cloud
- AWS Serverless Application Model (SAM)
- Amazon API Gateway HTTP API
- AWS Lambda
- Amazon DynamoDB
- Amazon S3
- Amazon Textract
- Amazon Cognito Identity Pools

### Testing
- Jest

## Architechture 

![Debtrix Architecture](<img width="960" height="700" alt="Debtrix Architecture Diagram" src="https://github.com/user-attachments/assets/b5eaad97-d9fa-472a-81bf-a774825649a2" />)

### How it works
1. A user adds participants and receipt items manually, or chooses a receipt image to scan.
2. Scanned images are uploaded directly to a private S3 bucket using temporary Cognito guest credentials.
3. An S3 event starts a Lambda function, which extracts receipt details with Amazon Textract and stores the scan status in DynamoDB.
4. The app assigns items to participants and sends the expense to the backend.
5. The backend splits shared items evenly, distributes tax and tip proportionally, saves the completed receipt, and returns a per-person breakdown.

## Getting Started

### Install dependencies 

Install the following before setting up the project: 
- Node.js and npm
- Expo-compatible Android or iOS tooling, or the Expo Go app, for mobile development
- An AWS account with permission to deploy the resources in `backend/template.yaml`
- AWS CLI configured with your credentials
- AWS SAM CLI
- Docker if you plan to use SAM's local emulation

The repository contains the Expo app in the `Debtrix` directory. From the repository root:
```bash
cd Debtrix
npm install
```

### Build and deploy the backend 

The app uses deployed AWS resources, so build and deploy the backend before starting Expo. From the app directory:
```bash
cd backend
npm install
sam build
sam deploy
```

### Configure environment variables

```dotenv
EXPO_PUBLIC_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
EXPO_PUBLIC_AWS_REGION=us-east-1
EXPO_PUBLIC_RECEIPT_BUCKET=your-receipt-images-bucket
EXPO_PUBLIC_COGNITO_IDENTITY_POOL_ID=us-east-1:your-identity-pool-id
```
Do not commit `.env`; it is intentionally ignored by Git.

### Start the app

Open another terminal, return to the app directory (the directory containing the frontend `package.json`), and start Expo:
```bash
npx expo start
```

## Testing

Backend unit tests are written with Jest.

From the backend directory:
```bash
npm test
```

## Project Structure

```text
Debtrix/
├──assets/                # Images and static assets
├──backend/               # AWS SAM serverless backend
│  ├──events/             # Sample events for local Lambda testing
│  ├──src/                # Lambda functions, backend logic, and tests
│  └──template.yaml       # AWS SAM infrastructure configuration
└──src/                   # Frontend application source
   ├──api/                # Backend API requests and integrations
   ├──app/                # Expo Router screens and navigation
   │  ├──(tabs)/          # Main tab-based screens
   │  └──receipt/         # Receipt overview from the home screen
   ├──components/         # Reusable React Native components
   ├──config/             # Application and service configuration
   ├──data/               # Static application data
   ├──hooks/              # Custom React hooks
   ├──lib/                # Shared utilities and helper functions
   ├──theme/              # Light/dark themes and shared styling
   └──types/              # Shared TypeScript type definitions
```

## Future Improvements

- Improve receipt parsing and item recognition
- Add authentication and user-specific receipt history
- Expand automated testing
- Improve scanner error handling

## Contributors

Debtrix was developed as a collaborative project by:

- [Stephanie Sarambo](https://github.com/sarambos)
- [Marian Sousan](https://github.com/MSDS1203)
