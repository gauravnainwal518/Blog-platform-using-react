import axios from 'axios';
import conf from "../conf/conf.js";

export const getAiResponse = async (inputText) => {
  if (!inputText || typeof inputText !== 'string') {
    throw new Error("Input must be a non-empty string");
  }

  try {
    const body = new URLSearchParams();
    body.append("body", JSON.stringify({ inputText }));

    const response = await axios.post(
      `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`,
      body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Appwrite-Project': conf.appwriteProjectId,
        },
      }
    );

    const execution = response.data;

    if (!execution || typeof execution.response !== 'string') {
      console.error(" Invalid Appwrite execution response:", execution);
      throw new Error("Invalid response format from Appwrite function");
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(execution.response);
    } catch (err) {
      throw new Error(" Cannot parse response from AI function");
    }

    if (parsedResponse.error) throw new Error(parsedResponse.error);
    return parsedResponse.output || "No response received";

  } catch (err) {
    console.error(" AI Service Error:", err);
    throw new Error(err.message || "Something went wrong");
  }
};
