import axios from 'axios';
import conf from "../conf/conf.js";

export const getAiResponse = async (inputText) => {
  console.log("[AI Service] Preparing request with input:", inputText);

  // Validate input
  if (!inputText) {
    throw new Error("Input text cannot be empty");
  }

  try {
    // Structure payload according to Appwrite Function requirements
    const payload = {
      data: JSON.stringify({
        inputText: typeof inputText === 'string' ? inputText : JSON.stringify(inputText)
      })
    };

    console.debug("[AI Service] Request payload:", payload);

    const response = await axios.post(
      `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`,
      payload,
      {
        headers: {
          'X-Appwrite-Project': conf.appwriteProjectId,
          'Content-Type': 'application/json',
          'X-Appwrite-Key': conf.appwriteApiKey // Ensure this is in your conf.js
        },
        timeout: 30000 // 30 second timeout
      }
    );

    console.debug("[AI Service] Raw response:", response);

    // Handle Appwrite function response structure
    if (!response.data) {
      throw new Error("Empty response from server");
    }

    // Parse nested response
    let result;
    try {
      result = typeof response.data === 'string' ? 
                JSON.parse(response.data) : 
                response.data;
      
      if (result.response) {
        result = JSON.parse(result.response);
      }
    } catch (e) {
      console.warn("[AI Service] Response parsing warning:", e);
      result = response.data;
    }

    // Check for errors in response
    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.output && !result.statusCode) {
      throw new Error("Malformed response structure");
    }

    return result.output || result;

  } catch (error) {
    console.error("[AI Service] Full Error Details:", {
      message: error.message,
      request: error.config?.data,
      response: error.response?.data,
      stack: error.stack
    });

    let errorMessage = "AI request failed";
    if (error.response) {
      errorMessage = error.response.data?.error || 
                   `Server responded with ${error.response.status}`;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = "Request timeout - try again later";
    }

    throw new Error(errorMessage);
  }
};