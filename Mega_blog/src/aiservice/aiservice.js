import axios from 'axios';
import conf from "../conf/conf.js";

export const getAiResponse = async (inputText) => {
  console.log("[AI Service] Initiating request with:", inputText);

  // Validate input
  if (!inputText || (typeof inputText !== 'string' && typeof inputText !== 'object')) {
    throw new Error("Input must be a string or object");
  }

  try {
    // Create properly formatted payload
    const payload = {
      inputText: typeof inputText === 'string' ? inputText : JSON.stringify(inputText)
    };

    // Stringify the entire payload for Appwrite
    const requestBody = JSON.stringify({ data: JSON.stringify(payload) });

    console.debug("[AI Service] Final request body:", requestBody);

    const response = await axios({
      method: 'post',
      url: `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`,
      data: requestBody,
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': conf.appwriteProjectId,
       
      },
      timeout: 30000
    });

    console.debug("[AI Service] Full response:", response);

    // Handle empty response
    if (!response.data) {
      throw new Error("Empty response from server");
    }

    // Parse nested response
    let result;
    try {
      result = response.data.response ? 
               JSON.parse(response.data.response) : 
               response.data;
    } catch (e) {
      console.warn("Response parsing warning:", e);
      result = response.data;
    }

    // Validate response structure
    if (result?.error) {
      throw new Error(result.error);
    }

    if (!result?.output && !result?.statusCode) {
      console.error("Invalid response structure:", result);
      throw new Error("Invalid response format from server");
    }

    return result.output || result;

  } catch (error) {
    console.error("[AI Service] Complete Error:", {
      message: error.message,
      request: error.config?.data,
      response: error.response?.data,
      stack: error.stack
    });

    throw new Error(
      error.response?.data?.error || 
      error.message || 
      "AI service unavailable"
    );
  }
};