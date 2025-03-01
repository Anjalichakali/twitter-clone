import React, { useState } from "react";
import { auth, provider, signInWithPopup, signOut, sendOTP } from "../firebase";
import { getUserDeviceInfo } from "../utils/detectBrowser";

const Login = () => {
  const [user, setUser] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  const handleLogin = async () => {
    const { browser, deviceType } = getUserDeviceInfo();
    console.log("Browser:", browser, "Device:", deviceType);

    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);

      if (browser === "Chrome") {
        // Send OTP to email for Chrome users
        await sendOTP({ email: result.user.email });
        setOtpSent(true);
        alert("OTP sent to your email. Verify before accessing.");
      } else if (browser === "Edge") {
        // Direct login for Edge users
        alert("You are using Microsoft Edge. Login successful.");
      } else if (deviceType === "smartphone") {
        // Restrict mobile login to 10 AM - 1 PM
        const currentHour = new Date().getHours();
        if (currentHour >= 10 && currentHour < 13) {
          alert("Login successful! You are using a mobile device within the allowed time.");
        } else {
          alert("Login from mobile is only allowed between 10 AM - 1 PM.");
          signOut(auth); // Logout if login is outside allowed time
          setUser(null);
        }
      } else {
        alert("Unsupported browser/device.");
      }
    } catch (error) {
      console.error("Login Failed:", error.message);
      alert("Login failed. Please try again.");
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    setOtpSent(false);
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.displayName}!</h2>
          <img src={user.photoURL} alt="Profile" width="50" />
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
};

export default Login;
