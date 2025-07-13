import axios from 'axios';
import conf from "../conf/conf.js";

export const getAiResponse = async (inputText) => {
  console.log("[AI Service] Initiating request with:", inputText);

  if (!inputText || (typeof inputText !== 'string' && typeof inputText !== 'object')) {
    throw new Error("Input must be a string or object");
  }

  try {
    const payload = {
      inputText: typeof inputText === 'string' ? inputText : JSON.stringify(inputText)
    };

    const requestBody = JSON.stringify({ data: JSON.stringify(payload) });

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

    // Parse the Appwrite response correctly
    let result;
    try {
      if (response.data?.response) {
        result = JSON.parse(response.data.response);
      } else {
        console.warn("Invalid Appwrite execution response:", response.data);
        throw new Error("Invalid response format from server");
      }
    } catch (e) {
      console.warn("Failed to parse Appwrite function response:", e);
      throw new Error("Unable to parse AI server response");
    }

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
