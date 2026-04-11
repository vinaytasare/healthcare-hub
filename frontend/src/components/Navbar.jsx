import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 dark:bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/dashboard" className="text-xl font-bold tracking-wide">
        🏥 Healthcare Hub
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="hover:text-blue-200 transition text-sm">Dashboard</Link>
        <Link to="/chatbot" className="hover:text-blue-200 transition text-sm">AI Chatbot</Link>
        <Link to="/hospitals" className="hover:text-blue-200 transition text-sm">Hospitals</Link>
        <Link to="/appointments" className="hover:text-blue-200 transition text-sm">Appointments</Link>
        {user?.role === "ADMIN" && (
          <Link to="/admin" className="hover:text-blue-200 transition text-sm">Admin</Link>
        )}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-blue-600 dark:hover:bg-gray-700 transition"
          title="Toggle theme"
        >
          {darkMode
            ? <Sun size={18} className="text-yellow-300" />
            : <Moon size={18} className="text-white" />
          }
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-blue-200">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;