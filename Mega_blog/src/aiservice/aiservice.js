import axios from 'axios';
import conf from "../conf/conf.js";

const appwriteFunctionUrl = `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`;

export const getAiResponse = async (inputText) => {
  console.log("📤 Sending request to Appwrite Function with:", inputText);
  console.log("🌐 Full Function URL:", appwriteFunctionUrl);

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

    console.log("✅ Raw Axios Response:", response);
    console.log("✅ Response Data:", response.data);

    const rawOutput = response?.data?.output;
    console.log("🧠 AI Output:", rawOutput);

    if (!rawOutput) {
      throw new Error("Empty or invalid response from Appwrite Function");
    }

    return rawOutput;

  } catch (error) {
    console.error("❌ AI Service Error: ", error.message);
    console.error("❌ Full Error Object:", error);
    console.error("❌ Error Response Data:", error?.response?.data);
    throw error;
  }
};
