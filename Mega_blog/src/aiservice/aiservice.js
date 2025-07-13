import axios from 'axios';
import conf from "../conf/conf.js";

const appwriteFunctionUrl = `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`;

export const getAiResponse = async (inputText) => {
  console.log("[AI Service] Input received:", inputText);

  try {
    const response = await axios.post(
      appwriteFunctionUrl,
      JSON.stringify(inputText),
      {
        headers: {
          'X-Appwrite-Project': conf.appwriteProjectId,
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        withCredentials: true
      }
    );

    console.log("[AI Service] Raw Response:", response.data);

    // Handle both direct and wrapped responses
    const responseData = response.data?.response || response.data;
    
    if (typeof responseData === 'string') {
      try {
        const parsed = JSON.parse(responseData);
        return parsed?.output || parsed;
      } catch {
        return responseData;
      }
    }

    if (responseData?.error) {
      throw new Error(responseData.error);
    }

    return responseData?.output || responseData;

  } catch (error) {
    console.error("[AI Service] Full Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    let errorMessage = "AI request failed";
    if (error.response) {
      errorMessage = error.response.data?.error || 
                   `Server responded with ${error.response.status}`;
    } else if (error.request) {
      errorMessage = "No response received from server";
    }

    throw new Error(errorMessage);
  }
};