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

    const rawOutput = response?.data?.response;

    if (!rawOutput) {
      throw new Error("Empty or invalid response from Appwrite Function");
    }

    let parsed;
    try {
      parsed = JSON.parse(rawOutput);
    } catch (err) {
      console.error("JSON parse error:", err);
      throw new Error("AI response could not be parsed.");
    }

    return parsed?.output || "No output received from AI.";

  } catch (error) {
    console.error("AI Service Error:", error?.response?.data || error.message);
    throw error;
  }
};
