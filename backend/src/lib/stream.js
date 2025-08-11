import { StreamChat } from "stream-chat";
import "dotenv/config";

// Support both STREAM_ and STEAM_ prefixes (typo tolerance)
const apiKey = process.env.STREAM_API_KEY || process.env.STEAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET || process.env.STEAM_API_SECRET;

console.log("Stream API Key (backend):", apiKey); // Added for debugging
console.log("Stream API Secret (backend):", apiSecret ? "Loaded (not displayed)" : "Missing"); // Added for debugging

let streamClient = null;
if (!apiKey || !apiSecret) {
  console.warn("Stream API key or secret is missing; video/chat features will be disabled in dev.");
} else {
  try {
    streamClient = StreamChat.getInstance(apiKey, apiSecret);
  } catch (error) {
    console.warn("Failed to initialize StreamChat client:", error?.message || error);
  }
}

export const upsertStreamUser = async (userData) => {
  if (!streamClient) return userData; // no-op when not configured
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
    return userData;
  }
};

export const generateStreamToken = (userId) => {
  if (!streamClient) return null; // no-op when not configured
  try {
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
    return null;
  }
};
