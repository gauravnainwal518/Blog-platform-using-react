import AiSearch from "./AiSearch";
import { useSelector } from "react-redux";

const AiAssistant = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div
      className={`min-h-screen p-6 mt-12 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h2
        className={`text-2xl font-semibold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        AI Assistant
      </h2>
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
