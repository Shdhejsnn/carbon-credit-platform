import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Auth from "./Auth";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    console.log("🚀 App Component Mounted!");
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
