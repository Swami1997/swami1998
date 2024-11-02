import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import CheckList from "./components/CheckList";

const App = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <>
      {location.pathname === "/checklist" && (
        <button
          onClick={handleLogout}
          className="fixed top-5 right-5 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300 shadow-lg"
        >
          Logout
        </button>
      )}
      {loading ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-75">
          <div className="relative w-12 h-12">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-blue-500 rounded-full animate-spin-dot`}
                style={{
                  transform: `rotate(${i * 36}deg) translate(20px) rotate(-${
                    i * 36
                  }deg)`,
                  animationDelay: `${i * 0.3}s`,
                }}
              ></div>
            ))}
          </div>
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Logging Out...
          </p>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/checklist" element={<CheckList />} />
        </Routes>
      )}
    </>
  );
};

export default App;
