import axios from 'axios';
import conf from "../conf/conf.js";

export const getAiResponse = async (inputText) => {
  console.log("[AI Service] Sending to AI:", inputText);

  try {
    // Ensure proper request formatting
    const requestData = {
      inputText: typeof inputText === 'string' ? inputText : JSON.stringify(inputText)
    };

    const response = await axios.post(
      `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`,
      requestData, // axios will automatically stringify this
      {
        headers: {
          'X-Appwrite-Project': conf.appwriteProjectId,
          'Content-Type': 'application/json',
        }
      }
    );

    // Handle both success and error responses from Appwrite
    if (response.data && response.data.statusCode !== 200) {
      throw new Error(response.data.error || "AI service returned an error");
    }

    return response.data?.output || response.data?.response;

  } catch (error) {
    console.error("[AI Service] Detailed Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    // More specific error messages
    let errorMessage = "AI request failed";
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};