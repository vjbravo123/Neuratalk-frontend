// src/components/chat/ChatInput.jsx
import React from "react";

const ChatInput = ({
  input,
  setInput,
  handleSend,
  handleKeyDown,
  sending,
  userId,
}) => (
  <div className="p-4 flex gap-2 bg-white border-t">
    <textarea
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={userId ? "Type your message..." : "Please login to chat"}
      className="flex-1 border rounded p-2 resize-none h-12"
      disabled={!userId}
    />

    <button
      onClick={handleSend}
      disabled={!userId || sending}
      className={`px-4 py-2 rounded text-white ${
        !userId || sending
          ? "bg-blue-300 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {sending ? "Sending..." : "Send"}
    </button>
  </div>
);

export default ChatInput;
