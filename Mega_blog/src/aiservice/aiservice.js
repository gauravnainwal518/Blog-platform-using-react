import axios from 'axios';
import conf from "../conf/conf.js";

export const getAiResponse = async (inputText) => {
  console.log("[AI Service] Initiating request with:", inputText);

  if (!inputText || typeof inputText !== 'string') {
    throw new Error("Input must be a non-empty string");
  }

  try {
    const payload = {
      inputText: inputText
    };

    // Appwrite expects a "body" field inside URLSearchParams
    const formEncodedBody = new URLSearchParams();
    formEncodedBody.append('body', JSON.stringify(payload));

    const response = await axios({
      method: 'post',
      url: `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Appwrite-Project': conf.appwriteProjectId,
      },
      data: formEncodedBody,
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
    } catch (err) {
      console.error("Failed to parse Appwrite function response:", err);
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
