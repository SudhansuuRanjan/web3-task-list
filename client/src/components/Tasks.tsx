import React from "react";

const Tasks = ({ taskText, onClick }: { taskText: string; onClick: any }) => {
  return (
    <div className="flex justify-between items-center px-2 mb-4">
      <p>{taskText}</p>
      <button
        className="py-1.5 px-3 text-sm bg-[#7a0000] rounded-xl hover:scale-105 hover:border-red-300 transition duration-500 ease-in-out border-red-500 border"
        onClick={onClick}
      >
        Del
      </button>
    </div>
  );
};

export default Tasks;
