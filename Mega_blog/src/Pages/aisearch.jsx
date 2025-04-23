import React, { useState } from "react";
import { getAiResponse } from "../aiservice/aiservice";
import { useSelector } from "react-redux"; // To get darkMode state

const AiSearch = () => {
  const [inputText, setInputText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isDarkMode = useSelector((state) => state.theme.isDarkMode); // Access dark mode state from Redux

  const handleSearch = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError("");
    setResponseText("");

    try {
      const result = await getAiResponse(inputText);
      setResponseText(result.response || "No response received.");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        isDarkMode ? "bg-gray-800" : "bg-gray-100"
      }`}
    >
      <div
        className={`max-w-xl mx-auto p-6 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        } rounded-lg shadow-lg space-y-6 w-full`}
      >
        <h2
          className={`text-2xl font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          AI Search
        </h2>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask something..."
          className={`w-full p-3 rounded border ${
            isDarkMode
              ? "bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-400"
              : "bg-gray-100 text-gray-800 border-gray-300 focus:ring-2 focus:ring-blue-400"
          } focus:outline-none`}
        />

        <button
          onClick={handleSearch}
          className={`px-6 py-2 rounded transition-all duration-200 ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Search"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {responseText && (
          <div
            className={`mt-4 p-4 rounded shadow-sm ${
              isDarkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <h4 className="text-lg font-semibold mb-2">AI Response:</h4>
            <p>{responseText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiSearch;
