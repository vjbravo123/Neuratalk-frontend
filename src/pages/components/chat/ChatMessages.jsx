// src/components/chat/ChatMessages.jsx
import React from "react";

const ChatMessages = ({ messages, loadingHistory, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3" aria-live="polite">
      {loadingHistory && (
        <div className="text-center text-sm text-gray-500">
          Loading chat history...
        </div>
      )}

      {messages.length === 0 && !loadingHistory && (
        <div className="text-center text-gray-500">
          No messages yet — say hi 👋
        </div>
      )}

      {messages.map((msg, index) => {
        const key = msg._id || msg.id || index;
        const isUser = msg.sender === "user";
        return (
          <div
            key={key}
            className={`max-w-[75%] p-3 rounded-lg break-words ${
              isUser
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-300 text-black mr-auto"
            }`}
          >
            {msg.text}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
