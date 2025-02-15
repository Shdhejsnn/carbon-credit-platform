import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage onClose={function (): void {
              throw new Error("Function not implemented.");
          } } />} />
      <Route path="/Dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
