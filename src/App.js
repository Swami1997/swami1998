// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import CheckList from "./components/CheckList";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/checklist" element={<CheckList />} />
    </Routes>
  );
};

export default App;
