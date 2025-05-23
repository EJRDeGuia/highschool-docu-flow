
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine where to redirect based on auth state
  const homeLink = user ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link 
          to={homeLink} 
          className="text-blue-500 hover:text-blue-700 underline font-medium px-4 py-2 border border-blue-500 rounded hover:bg-blue-50 transition-colors"
        >
          Return to {user ? 'Dashboard' : 'Login'}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
