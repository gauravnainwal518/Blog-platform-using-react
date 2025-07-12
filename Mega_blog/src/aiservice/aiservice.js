import axios from 'axios';
import conf from "../conf/conf.js";

const appwriteFunctionUrl = `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`;

export const getAiResponse = async (inputText) => {
  try {
    const response = await axios.post(
      appwriteFunctionUrl,
      { inputText }, // Send raw JSON object
      {
        headers: {
          'X-Appwrite-Project': conf.appwriteProjectId,
          'Content-Type': 'application/json',
        },
      }
    );

    const parsed = JSON.parse(response.data.response);
    return parsed.output; // Use correct key returned from function

  } catch (error) {
    console.error('AI Service Error:', error?.response?.data || error.message);
    throw error;
  }
};
