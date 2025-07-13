import axios from 'axios';
import conf from "../conf/conf.js";

const appwriteFunctionUrl = `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`;

export const getAiResponse = async (inputText) => {
  console.log("InputText received in service:", inputText);

  try {
    const response = await axios.post(
      appwriteFunctionUrl,
      JSON.stringify(inputText), // Send as raw string
      {
        headers: {
          'X-Appwrite-Project': conf.appwriteProjectId,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Raw Response from Appwrite:", response.data);

    // Handle both direct response and wrapped response cases
    const responseData = response.data?.response || response.data;
    
    if (typeof responseData === 'string') {
      try {
        const parsed = JSON.parse(responseData);
        return parsed?.output || parsed;
      } catch {
        return responseData; // Return as-is if not JSON
      }
    }

    return responseData?.output || responseData;

  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw new Error(`AI Service failed: ${error.message}`);
  }
};