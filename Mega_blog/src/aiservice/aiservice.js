import axios from 'axios';
import conf from "../conf/conf.js";

const appwriteFunctionUrl = `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`;

export const getAiResponse = async (inputText) => {
  console.log("InputText received in service:", inputText);

  try {
    const response = await axios.post(
      appwriteFunctionUrl,
      { inputText }, //  send as plain object
      {
        headers: {
          'X-Appwrite-Project': conf.appwriteProjectId,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Raw Response from Appwrite:", response);

    //  Appwrite returns { output: "...text..." }
    const output = response?.data?.output;

    if (!output) {
      throw new Error("Appwrite Function returned empty response");
    }

    return output;

  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw error;
  }
};
