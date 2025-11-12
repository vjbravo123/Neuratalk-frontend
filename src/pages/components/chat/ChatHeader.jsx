// src/components/chat/ChatHeader.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user from Redux (fallback to localStorage)
  const reduxUser = useSelector((state) => state.user);
  
  const storedUser =JSON.parse(localStorage.getItem("userInfo")) || {};
  const user = reduxUser && Object.keys(reduxUser).length > 0 ? reduxUser : storedUser;

  // Basic user info
  const userName = user?.name || user?.displayName || user?.email || "Guest";
  const profilePic = user?.picture || user?.avatar || null;

  // Logout handler
  const handleLogout = () => {
    // 1. Clear redux user if you have a logout action
    if (dispatch && typeof dispatch === "function") {
      try {
        dispatch({ type: "LOGOUT" }); // adjust this if your slice has a custom logout reducer
      } catch (e) {
        console.warn("Redux logout skipped (no reducer found)");
      }
    }

    // 2. Clear localStorage
    localStorage.removeItem("userInfo");

    // 3. Redirect to home
    navigate("/");
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow">
      {/* Left side - App title */}
      <h1 className="text-lg sm:text-xl font-bold">NeuraTalk AI Chat</h1>

      {/* Right side - User info + logout */}
      <div className="flex items-center gap-3">
        {profilePic ? (
          <img
            src={profilePic}
            alt="Profile"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold uppercase">
            {userName?.[0] || "U"}
          </div>
        )}
        <span className="text-sm sm:text-base font-medium truncate max-w-[100px] sm:max-w-[150px]">
          {userName}
        </span>

        <button
          onClick={handleLogout}
          className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white text-sm font-semibold"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
