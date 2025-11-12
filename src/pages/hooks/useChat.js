// src/hooks/useChat.js
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export const useChat = (reduxUserId) => {
  const [userId, setUserId] = useState(reduxUserId || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef(null);

  // 🧩 On mount, recover user from localStorage if reduxUserId not available
  useEffect(() => {
    if (!reduxUserId) {
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const id =
            parsed?._id || parsed?.id || parsed?.ID || parsed?.userId;
          if (id) {
            setUserId(id);
          }
        } catch (err) {
          console.error("❌ Failed to parse userInfo from localStorage:", err);
        }
      }
    } else {
      setUserId(reduxUserId);
    }
  }, [reduxUserId]);

  // scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat history whenever userId becomes available
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!userId) return;
      try {
        setLoadingHistory(true);
        const res = await axios.get("http://localhost:5000/api/chat/history", {
          headers: { "x-user-id": userId },
        });
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.messages || [];
        setMessages(data);
      } catch (err) {
        console.error("❌ Error fetching chat history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchChatHistory();
  }, [userId]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!userId) {
      alert("User not detected. Please login again.");
      return;
    }

    const userMessage = {
      _id: `local-${Date.now()}`,
      sender: "user",
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat/send",
        { message: trimmed },
        { headers: { "x-user-id": userId } }
      );

      const aiReplyText =
        res?.data?.reply ?? res?.data?.text ?? "Sorry, no reply.";

      const aiMessage = {
        _id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiReplyText,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("❌ Error sending message:", err);
      const errorMsg = {
        _id: `err-${Date.now()}`,
        sender: "ai",
        text: "Oops! Something went wrong. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return {
    messages,
    input,
    setInput,
    sending,
    loadingHistory,
    handleSend,
    handleKeyDown,
    messagesEndRef,
  };
};
