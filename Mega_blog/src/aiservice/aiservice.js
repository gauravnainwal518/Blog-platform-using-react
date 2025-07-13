import axios from 'axios';
import conf from "../conf/conf.js";

export const getAiResponse = async (inputText) => {
  console.log("[AI Service] Sending to AI:", inputText);

  try {
    // Structure the input properly
    const requestData = typeof inputText === 'string' 
      ? { inputText } 
      : inputText;

    const response = await axios.post(
      `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`,
      requestData, // No need for JSON.stringify - axios handles it
      {
        headers: {
          'X-Appwrite-Project': conf.appwriteProjectId,
          'Content-Type': 'application/json',
        }
      }
    );

    // Handle response format
    if (response.data?.statusCode !== 200) {
      throw new Error(response.data?.error || "AI service error");
    }

    return response.data.output;

  } catch (error) {
    console.error("[AI Service] Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    let errorMessage = "AI request failed";
    if (error.response) {
      errorMessage = error.response.data?.error || 
                   `Server error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = "No response from server";
    }

    throw new Error(errorMessage);
  }
};