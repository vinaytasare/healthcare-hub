import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tips, setTips] = useState([]);

  useEffect(() => {
    api.get("/api/tips").then((res) => setTips(res.data)).catch(() => {});
  }, []);

  const cards = [
    { title: "AI Health Chatbot", desc: "Get instant answers powered by Gemini AI.", icon: "🤖", path: "/chatbot", color: "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800" },
    { title: "Find Hospitals", desc: "Locate nearby hospitals using OpenStreetMap.", icon: "🏥", path: "/hospitals", color: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" },
    { title: "My Profile", desc: "View and manage your personal health profile.", icon: "👤", path: "/profile", color: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800" },
    { title: "Appointments", desc: "Book and manage your medical appointments.", icon: "📅", path: "/appointments", color: "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800" },
    { title: "Chat History", desc: "View your past AI health conversations.", icon: "💬", path: "/chat-history", color: "bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-800" },
    { title: "BMI Calculator", desc: "Calculate your Body Mass Index.", icon: "⚖️", path: "/bmi", color: "bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">What would you like to do today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className={`border-2 ${card.color} rounded-2xl p-6 cursor-pointer hover:shadow-md transition`}
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{card.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{card.desc}</p>
            </div>
          ))}
        </div>

        {tips.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              💡 Daily Health Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tips.map((tip) => (
                <div key={tip.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-5">
                  <div className="text-3xl mb-3">{tip.icon}</div>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                    {tip.category}
                  </span>
                  <h4 className="font-semibold text-gray-800 dark:text-white mt-2">{tip.title}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{tip.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;