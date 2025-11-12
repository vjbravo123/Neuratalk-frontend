// src/pages/Chatpage.jsx
import { useEffect } from "react";
import { useSelector } from "react-redux";
import ChatHeader from "./components/chat/ChatHeader";
import ChatMessages from "./components/chat/ChatMessages";
import ChatInput from "./components/chat/ChatInput";
import { useChat } from "./hooks/useChat";

const Chatpage = () => {
  const user = useSelector((state) => state.user);

  // Determine userId
  const userId = user?._id || user?.id || user?.ID || user?.userId;

  // ✅ Save user info in localStorage for persistence
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      localStorage.setItem("userInfo", JSON.stringify(user));
    }
  }, [user]);

  // Pass userId (from redux/localstorage handled in hook)
  const {
    messages,
    input,
    setInput,
    sending,
    loadingHistory,
    handleSend,
    handleKeyDown,
    messagesEndRef,
  } = useChat(userId);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <ChatHeader />
      <ChatMessages
        messages={messages}
        loadingHistory={loadingHistory}
        messagesEndRef={messagesEndRef}
      />
      <ChatInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        handleKeyDown={handleKeyDown}
        sending={sending}
        userId={userId}
      />
    </div>
  );
};

export default Chatpage;
