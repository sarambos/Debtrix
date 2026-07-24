import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { calculateSplit, CalculateSplitInput } from "./calculateSplit";

const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
};

function response(statusCode: number, body: unknown): APIGatewayProxyResultV2 {
    return {
        statusCode,
        headers,
        body: JSON.stringify(body)
    };
}

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    try {
        if (!event.body) {
            return response(400, { message: "Request body is required" });
        }

        const input = JSON.parse(event.body) as CalculateSplitInput;

        const result = calculateSplit(input);

        return response(200, result);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to calculate split";

        return response(400, { message });
    }
}