import axios from 'axios';
import conf from "../conf/conf.js";

export const getAiResponse = async (inputText) => {
  console.log("[AI Service] Initiating request with:", inputText);

  if (!inputText || typeof inputText !== 'string') {
    throw new Error("Input must be a valid string");
  }

  try {
    const payload = {
      inputText: inputText
    };

    const requestBody = JSON.stringify({ data: JSON.stringify(payload) });

    const response = await axios({
      method: 'post',
      url: `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`,
      data: requestBody,
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': conf.appwriteProjectId
      },
      timeout: 30000
    });

    // ✅ Parse Appwrite's execution response
    if (!response.data || !response.data.response) {
      console.error("Invalid Appwrite execution response:", response.data);
      throw new Error("Invalid Appwrite function response format");
    }

    let result;
    try {
      result = JSON.parse(response.data.response); // response is a stringified JSON
    } catch (parseErr) {
      console.error("Failed to parse Appwrite function response:", parseErr);
      throw new Error("Unable to parse AI server response");
    }

    if (result?.error) throw new Error(result.error);
    if (!result?.output) throw new Error("No output generated");

    return result.output;

  } catch (error) {
    console.error("[AI Service] Complete Error:", {
      message: error.message,
      request: error.config?.data,
      response: error.response?.data,
      stack: error.stack
    });

    throw new Error(
      error.response?.data?.error || error.message || "AI service unavailable"
    );
  }
};
