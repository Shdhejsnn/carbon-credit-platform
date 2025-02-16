import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Trading from "./pages/Trading";  // Add this import for Trading
import Profile from "./pages/Profile"; // Import the Profile component
import GreenScore from "./pages/GreenScore"; // Import the GreenScore component

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage onClose={function (): void { throw new Error("Function not implemented."); }} />} />
      <Route path="/dashboard" element={<Dashboard />} /> {/* Ensure the path is lowercase */}
      <Route path="/trading" element={<Trading />} /> {/* Add the Trading route */}
      <Route path="/profile" element={<Profile />} /> {/* Add the Profile route */}
      <Route path="/greenscore" element={<GreenScore companyAddress={""} />} /> {/* Add the GreenScore route */}
    </Routes>
  );
};

export default App;