import React, { useState, useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase"; // Ensure firebase is correctly configured

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Login = () => {
  const [browser, setBrowser] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
      setBrowser("Chrome");
    } else if (userAgent.includes("Edg")) {
      setBrowser("Edge");
    } else if (/Mobi|Android|iPhone/.test(userAgent)) {
      setBrowser("Mobile");
    } else {
      setBrowser("Other");
    }
  }, []);

  const handleLogin = async () => {
    try {
      if (browser === "Chrome") {
        // Handle OTP sending here (Backend required)
        alert("You are using Chrome. Sending OTP via email...");
      } else if (browser === "Edge") {
        alert("You are using Edge. Login successful without authentication.");
      } else if (browser === "Mobile") {
        const currentHour = new Date().getHours();
        if (currentHour >= 10 && currentHour <= 13) {
          alert("You are on Mobile. Login allowed between 10 AM - 1 PM.");
        } else {
          setError("Login is allowed only between 10 AM - 1 PM on Mobile.");
          return;
        }
      } else {
        setError("Unsupported browser. Please use Chrome, Edge, or Mobile.");
        return;
      }

      const result = await signInWithPopup(auth, provider);
      alert(`Welcome ${result.user.displayName}!`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
