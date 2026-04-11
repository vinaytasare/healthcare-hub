import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const ChatHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/chat/history")
      .then((res) => setHistory(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Chat History</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Your past AI health conversations</p>

        {loading && <p className="text-gray-400 text-center py-10">Loading...</p>}

        {!loading && history.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-8 text-center text-gray-400 dark:text-gray-500">
            No chat history yet. Start a conversation with the AI Chatbot!
          </div>
        )}

        <div className="flex flex-col gap-4">
          {history.map((chat) => (
            <div key={chat.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(chat.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-end mb-2">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-none text-sm max-w-[80%]">
                  {chat.userMessage}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-2xl rounded-bl-none text-sm max-w-[80%]">
                  <span className="text-xs font-semibold text-blue-500 dark:text-blue-400 block mb-1">
                    Health Assistant
                  </span>
                  {chat.botResponse}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;