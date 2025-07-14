import React from "react";

function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-4 transition-colors duration-300">
      <div
        className={`animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 dark:border-t-blue-300 border-gray-300 dark:border-gray-600 shadow-md`}
      ></div>
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 animate-pulse">
        Loading...
      </p>
    </div>
  );
}

export default Loader;
