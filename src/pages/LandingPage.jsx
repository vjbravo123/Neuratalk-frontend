import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/UserSlice";

const LandingPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isExistingUser, setIsExistingUser] = useState(false);

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [step, setStep] = useState("email"); // email → otp → password
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [loadingEmail, setLoadingEmail] = useState(false);

    // ✅ Handle Google Login success
   const onGoogleSuccess = async (tokenResponse) => {
    setLoadingGoogle(true);
    try {
        const { access_token } = tokenResponse;

        // Get user info from Google
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const user = res.data;

        // Send to backend
        const backendRes = await axios.post("http://localhost:5000/api/auth/google", {
            email: user.email,
            name: user.name,
            picture: user.picture,
            email_verified: user.email_verified,
        });

        setMessage(backendRes.data.message || "Google login successful!");

        // ✅ Navigate if user exists or first-time Google login
        // backend should return success = true if login is successful
        if (backendRes.data.success) {
            dispatch(setUser(backendRes.data.user))
            navigate("/chatpage"); // Go to chat page immediately
        }

        // If first-time Google user and backend wants password creation (rare case)
        else if (!backendRes.data.success && backendRes.data.requirePassword) {
            setStep("password");
            setIsExistingUser(false);
        }

    } catch (err) {
        console.error("❌ Google login failed:", err);
        setMessage("Google login failed. Please try again.");
    } finally {
        setLoadingGoogle(false);
    }
};




    const login = useGoogleLogin({
        onSuccess: onGoogleSuccess,
        onError: () => setMessage("Google login failed."),
    });

    // ✅ Step 1: Send OTP

    const handleSendOtp = async () => {
  if (!email) return setMessage("Please enter your email.");
  setLoadingEmail(true);
  try {
    const res = await axios.post("http://localhost:5000/api/auth/send-otp", { email });
    
    // Message from backend
    setMessage(res.data.message);

    // Check if email is registered via Google
    if (res.data.message === "User already verified. Please sign in with Google.") {
      // Don't change step, just show the message
      return;
    }

    // Existing user with password
    if (res.data.message === "User already registered. Enter password to continue.") {
      setIsExistingUser(true);
      setStep("password"); // show password input
      return;
    }

    // New user, proceed to OTP step
    setIsExistingUser(false);
    setStep("otp");

  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    setMessage("Error sending OTP. Try again later.");
  } finally {
    setLoadingEmail(false);
  }
};




    // ✅ Step 2: Verify OTP
    const handleVerifyOtp = async () => {
        if (!otp) return setMessage("Please enter the OTP.");
        setLoadingEmail(true);
        try {
            const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
            setMessage(res.data.message);
            if (res.data.success) setStep("password");
        } catch (err) {
            console.error("❌ Error verifying OTP:", err);
            setMessage("Invalid or expired OTP.");
        } finally {
            setLoadingEmail(false);
        }
    };

    // ✅ Step 3: Create Password
   // ✅ Step 3: Create Password or Login (depending on user type)
const handleCreatePassword = async () => {
  if (!password) return setMessage("Please enter your password.");
  setLoadingEmail(true);

  try {
    let res;

    // 👇 If it's an existing user → LOGIN
    if (isExistingUser) {
      res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
    } 
    // 👇 Otherwise → SET PASSWORD for new user
    else {
      res = await axios.post("http://localhost:5000/api/auth/set-password", {
        email,
        password,
      });
    }

    setMessage(res.data.message);

    // ✅ Navigate if login or registration successful
    if (res.data.success) {
      // save user info in redux
      dispatch(setUser(res.data.user));
      navigate("/chatpage");
    } else {
      setMessage(res.data.message);
    }
  } catch (err) {
    console.error("❌ Error:", err);
    setMessage(isExistingUser ? "Login failed. Check your password." : "Error setting password.");
  } finally {
    setLoadingEmail(false);
  }
};


    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white to-blue-50 px-6">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
                <h1 className="text-3xl font-semibold mb-6 text-gray-800">
                    Welcome to <span className="text-blue-600">NeuraTalk</span>
                </h1>

                {/* ✅ Google Login */}
                <button
                    onClick={login}
                    disabled={loadingGoogle}
                    className="flex items-center justify-center w-full gap-3 border border-gray-300 rounded-lg px-5 py-2 hover:bg-gray-100 transition mb-4"
                >
                    <FcGoogle size={22} />
                    {loadingGoogle ? "Please wait..." : "Continue with Google"}
                </button>

                {/* ✅ Continue with Phone (future feature) */}
                <button
                    className="flex items-center justify-center w-full gap-3 border border-gray-300 rounded-lg px-5 py-2 hover:bg-gray-100 transition mb-4"
                >
                    <FaPhone className="text-green-500" />
                    Continue with Phone
                </button>

                {/* Divider */}
                <div className="flex items-center my-4">
                    <hr className="flex-grow border-gray-300" />
                    <span className="px-2 text-gray-500 text-sm">OR</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                {/* ✅ Step-wise UI */}
                {step === "email" && (
                    <>
                        <div className="text-left mb-4">
                            <label htmlFor="email" className="text-gray-700 text-sm font-medium">
                                Email Address
                            </label>
                            <div className="flex items-center border rounded-lg mt-2 px-3">
                                <FaEnvelope className="text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    className="w-full p-2 focus:outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleSendOtp}
                            disabled={loadingEmail}
                            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            {loadingEmail ? "Sending OTP..." : "Continue with Email"}
                        </button>
                    </>
                )}

                {step === "otp" && (
                    <>
                        <div className="text-left mb-4">
                            <label htmlFor="otp" className="text-gray-700 text-sm font-medium">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                id="otp"
                                placeholder="Enter the 6-digit OTP"
                                className="w-full border rounded-lg mt-2 p-2 focus:outline-none"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleVerifyOtp}
                            disabled={loadingEmail}
                            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            {loadingEmail ? "Verifying OTP..." : "Verify OTP"}
                        </button>
                    </>
                )}

                {step === "password" && (
                    <>
                        <div className="text-left mb-4">
                            <label htmlFor="password" className="text-gray-700 text-sm font-medium">
                                {isExistingUser ? "Enter Password" : "Create Password"}
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder={isExistingUser ? "Enter your password" : "Enter a strong password"}
                                className="w-full border rounded-lg mt-2 p-2 focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleCreatePassword}
                            disabled={loadingEmail}
                            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            {loadingEmail ? "Saving..." : isExistingUser ? "Login" : "Set Password"}
                        </button>
                    </>
                )}




                {/* Message Display */}
                {message && (
                    <p className="mt-4 text-sm text-gray-700 bg-blue-50 border border-blue-100 rounded p-2">
                        {message}
                    </p>
                )}
            </div>

            <p className="mt-6 text-sm text-gray-500">
                By continuing, you agree to our{" "}
                <span className="text-blue-600 cursor-pointer hover:underline">
                    Terms & Privacy Policy
                </span>
            </p>
        </div>
    );
};

export default LandingPage;
