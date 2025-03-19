import React, { useState } from "react";

const App = () => {
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const clearInput = () => {
    setInput("");
  };

  const deleteLast = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const calculateResult = () => {
    try {
      setInput(eval(input).toString());
    } catch (error) {
      setInput("Error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">🧮 Calculator</h1>

      <div className="bg-white shadow-lg rounded-xl p-4 w-full max-w-sm">
        {/* Result Display */}
        <div className="text-right bg-gray-200 text-2xl font-mono p-4 rounded mb-4 h-16 flex items-center justify-end">
          {input || "0"}
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* First Row */}
          <button onClick={clearInput} className="col-span-2 bg-red-500 text-white py-3 rounded text-lg font-bold hover:bg-red-600">
            C
          </button>
          <button onClick={deleteLast} className="bg-yellow-500 text-white py-3 rounded text-lg font-bold hover:bg-yellow-600">
            ⌫
          </button>
          <button onClick={() => handleClick("/")} className="bg-blue-500 text-white py-3 rounded text-lg font-bold hover:bg-blue-600">
            ÷
          </button>

          {/* Second Row */}
          {[7, 8, 9, "*"].map((item) => (
            <button key={item} onClick={() => handleClick(item)} className="bg-gray-300 text-gray-800 py-3 rounded text-lg font-bold hover:bg-gray-400">
              {item}
            </button>
          ))}

          {/* Third Row */}
          {[4, 5, 6, "-"].map((item) => (
            <button key={item} onClick={() => handleClick(item)} className="bg-gray-300 text-gray-800 py-3 rounded text-lg font-bold hover:bg-gray-400">
              {item}
            </button>
          ))}

          {/* Fourth Row */}
          {[1, 2, 3, "+"].map((item) => (
            <button key={item} onClick={() => handleClick(item)} className="bg-gray-300 text-gray-800 py-3 rounded text-lg font-bold hover:bg-gray-400">
              {item}
            </button>
          ))}

          {/* Last Row */}
          <button onClick={() => handleClick("0")} className="col-span-2 bg-gray-300 text-gray-800 py-3 rounded text-lg font-bold hover:bg-gray-400">
            0
          </button>
          <button onClick={() => handleClick(".")} className="bg-gray-300 text-gray-800 py-3 rounded text-lg font-bold hover:bg-gray-400">
            .
          </button>
          <button onClick={calculateResult} className="bg-green-500 text-white py-3 rounded text-lg font-bold hover:bg-green-600">
            =
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
