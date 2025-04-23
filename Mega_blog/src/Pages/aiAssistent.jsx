import AiSearch from "./aisearch";
import { useSelector } from "react-redux"; // To get the darkMode state

const AiAssistant = () => {
  // Get the darkMode state from Redux or context
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div
      className={`min-h-screen p-6 mt-12 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Light or dark background for the entire page */}
      <h2
        className={`text-2xl font-semibold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        AI Assistant
      </h2>
      {/* Light or dark theme container for AiSearch */}
      <div
        className={`p-6 rounded-lg shadow-lg ${
          isDarkMode ? "bg-gray-700" : "bg-white"
        }`}
      >
        <AiSearch />
      </div>
    </div>
  );
};

export default AiAssistant;
