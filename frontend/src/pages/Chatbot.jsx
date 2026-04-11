import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { Trash2 } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I am your AI health assistant powered by Gemini. Ask me anything about your health!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/api/chat/send", { message: input });
      setMessages((prev) => [...prev, { role: "bot", text: res.data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm("Clear all chat history?")) return;
    try {
      await api.delete("/api/chat/history/clear");
      setMessages([
        { role: "bot", text: "Chat history cleared. How can I help you today?" },
      ]);
    } catch {
      alert("Failed to clear history.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI Health Chatbot</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Powered by Google Gemini</p>
          </div>
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 px-3 py-2 rounded-xl transition"
          >
            <Trash2 size={16} />
            Clear History
          </button>
        </div>

        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-4 overflow-y-auto h-[500px] flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none"
              }`}>
                {msg.role === "bot" && (
                  <span className="text-xs font-semibold text-blue-500 dark:text-blue-400 block mb-1">
                    Health Assistant
                  </span>
                )}
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-4 py-3 rounded-2xl rounded-bl-none text-sm">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a health question..."
            className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;