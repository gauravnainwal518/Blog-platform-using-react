import axios from 'axios';
import conf from "../conf/conf.js";

const appwriteFunctionUrl = `${conf.appwriteUrl}/functions/${conf.appwriteFunctionId}/executions`;

export const getAiResponse = async (inputText) => {
  console.log("InputText received in service:", inputText);

  if (!inputText || typeof inputText !== "string" || inputText.trim() === "") {
    throw new Error("Invalid inputText");
  }

  try {
    const response = await axios.post(
      appwriteFunctionUrl,
      {
        data: JSON.stringify({ inputText }), // 👈 required by Appwrite
        async: false
      },
      {
        headers: {
          'X-Appwrite-Project': conf.appwriteProjectId,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Raw Response from Appwrite:", response);

    const rawString = response?.data?.response;

    if (!rawString) {
      throw new Error("Appwrite Function returned empty response");
    }

    let parsed;
    try {
      parsed = JSON.parse(rawString);
    } catch (err) {
      console.error("Failed to parse function response:", rawString);
      throw new Error("Could not parse Appwrite Function response.");
    }

    const output = parsed?.output;
    if (!output) throw new Error("Parsed response missing output field.");

    return output;

  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw error;
  }
};
