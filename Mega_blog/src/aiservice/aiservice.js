import axios from 'axios';
import conf from "../conf/conf.js";

const appwriteFunctionUrl = `${conf.appwriteUrl}/v1/functions/${conf.appwriteFunctionId}/executions`;

export const getAiResponse = async (inputText) => {
  try {
    const response = await axios.post(
      appwriteFunctionUrl,
      JSON.stringify({ inputText }), // Send raw stringified JSON
      {
        headers: {
          'X-Appwrite-Project': conf.appwriteProjectId,
          'Content-Type': 'application/json',
        },
      }
    );

    // Parse the function's output
    const parsed = JSON.parse(response.data.response);
    return parsed.response;

  } catch (error) {
    console.error('❌ AI Service Error:', error?.response?.data || error.message);
    throw error;
  }
};
