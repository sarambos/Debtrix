const apiURL = process.env.EXPO_PUBLIC_API_URL;

if (!apiURL) {
    throw new Error("EXPO_PUBLIC_API_URL is not configured.");
}

export const environment = { apiURL };