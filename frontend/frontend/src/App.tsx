import React from "react"
import Login from "./components/Login"
import { Route, Routes } from "react-router-dom";
const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App
