import axios from 'axios';
import conf from "../conf/conf.js";

export const getAiResponse = async (inputText) => {
  if (!inputText || typeof inputText !== 'string') {
    throw new Error("Input must be a non-empty string");
  }

  const formData = new URLSearchParams();
  formData.append("data", JSON.stringify({ inputText }));

  try {
    const response = await axios({
      method: 'post',
      url: `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`,
      data: formData,  //  NO .toString()
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Appwrite-Project': conf.appwriteProjectId,
      }
    });

    const execution = response.data;

    if (!execution || typeof execution.response !== 'string') {
      console.error("Invalid Appwrite execution response:", execution);
      throw new Error("Invalid response format from Appwrite function");
    }

    const parsed = JSON.parse(execution.response);
    if (parsed.error) throw new Error(parsed.error);

    return parsed.output || "No response received";
  } catch (err) {
    console.error(" AI Service Error:", err);
    throw new Error(err.message || "Something went wrong");
  }
};
