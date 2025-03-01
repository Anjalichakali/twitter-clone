import React, { useState } from "react";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import LoginTracking from "./components/LoginTracking";

const App = () => {
  const [user, setUser] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div>
      {showForgotPassword ? (
        <ForgotPassword />
      ) : user ? (
        <>
          <h2>Welcome, {user.displayName}!</h2>
          <LoginTracking />
        </>
      ) : (
        <>
          <Login setUser={setUser} />
          <p>
            <button onClick={() => setShowForgotPassword(true)}>Forgot Password?</button>
          </p>
        </>
      )}
    </div>
  );
};

export default App;
