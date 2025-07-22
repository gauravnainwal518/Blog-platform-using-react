import AiSearch from "./AiSearch";

const AiAssistant = () => {
  return (
    <div className="min-h-screen p-6 mt-12 bg-white text-gray-800">
      <h2 className="text-2xl font-semibold mb-4">AI Assistant</h2>
      <div className="p-6 rounded-lg shadow-lg bg-white">
        <AiSearch />
      </div>
    </div>
  );
};

export default AiAssistant;
