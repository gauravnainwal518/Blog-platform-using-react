import axios from 'axios';
import conf from "../conf/conf.js";

const appwriteFunctionUrl = `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`;

export const getAiResponse = async (inputText) => {
  try {
    const response = await axios.post(
      appwriteFunctionUrl,
      JSON.stringify({ inputText }),
      {
        headers: {
          'X-Appwrite-Project': conf.appwriteProjectId,
          'Content-Type': 'application/json',
        },
      }
    );

    // Debug log - check the full response
    console.log(" Full AI Function Response:", response);
    console.log(" Response Data:", response.data);

    // Extract the correct field
    const rawOutput = response?.data?.output;

    // Log what we received
    console.log(" Raw Output from AI:", rawOutput);

    // Handle empty/missing output
    if (!rawOutput) {
      console.error(" AI Function returned no output:", response.data);
      throw new Error("Empty or invalid response from Appwrite Function");
    }

    return rawOutput;

  } catch (error) {
    console.error("🛑 AI Service Error:", error?.response?.data || error.message);
    throw error;
  }
};
