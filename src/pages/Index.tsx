import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user) {
      navigate("/dashboard");
    } else {
      // Otherwise redirect to login
      navigate("/login");
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-school-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Document Request System</h1>
        <p className="text-xl text-gray-600 mb-4">Redirecting...</p>
        <div className="w-16 h-16 border-4 border-school-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default Index;
