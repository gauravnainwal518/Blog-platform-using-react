import axios from 'axios';
import conf from "../conf/conf.js";

export const getAiResponse = async (inputText) => {
  console.log("[AI Service] Initiating request with:", inputText);

  if (!inputText || (typeof inputText !== 'string' && typeof inputText !== 'object')) {
    throw new Error("Input must be a string or object");
  }

  try {
    const payload = {
      inputText: typeof inputText === 'string' ? inputText : JSON.stringify(inputText)
    };

    // Directly stringify payload instead of using URLSearchParams
    const requestBody = JSON.stringify({ data: JSON.stringify(payload) });

    const response = await axios({
      method: 'post',
      url: `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`,
      data: requestBody,
      headers: {
        'Content-Type': 'application/json', //  Important: set correct content type
        'X-Appwrite-Project': conf.appwriteProjectId,
      },
      timeout: 30000
    });

    const execution = response.data;

    if (!execution || typeof execution.response !== 'string') {
      console.error("Invalid Appwrite execution response:", execution);
      throw new Error("Invalid response format from server");
    }

    let parsed;
    try {
      parsed = JSON.parse(execution.response);
    } catch (parseErr) {
      console.error("Failed to parse Appwrite function response:", parseErr);
      throw new Error("Unable to parse AI server response");
    }

    if (parsed.error) throw new Error(parsed.error);
    if (!parsed.output) throw new Error("AI response is empty");

    return parsed.output;

  } catch (error) {
    console.error("[AI Service] Complete Error:", {
      message: error.message,
      request: error.config?.data,
      response: error.response?.data,
      stack: error.stack
    });

    throw new Error(
      error.response?.data?.error ||
      error.message ||
      "AI service unavailable"
    );
  }
};
