import axios from 'axios';
import conf from "../conf/conf.js";

const appwriteFunctionUrl = `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`;

export const getAiResponse = async (inputText) => {
  console.log("InputText received in service:", inputText);

  try {
    const response = await axios.post(
      appwriteFunctionUrl,
      { inputText },
      {
        headers: {
          'X-Appwrite-Project': conf.appwriteProjectId,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Raw Response from Appwrite:", response);

    //  Appwrite wraps actual response inside `response` field (as string)
    const wrapped = response?.data?.response;

    if (!wrapped) {
      throw new Error("Appwrite Function returned empty response");
    }

    //  Unwrap stringified JSON
    const parsed = JSON.parse(wrapped);

    if (!parsed?.output) {
      throw new Error("Parsed response missing 'output' field");
    }

    return parsed.output;

  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw error;
  }
};
