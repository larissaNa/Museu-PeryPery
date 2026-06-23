import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";

export const Auth: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isRegisterMode = queryParams.get("mode") === "register";
  const [isLogin, setIsLogin] = useState(!isRegisterMode);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      {isLogin ? (
        <Login onToggleMode={toggleMode} />
      ) : (
        <Register onToggleMode={toggleMode} />
      )}
    </>
  );
};


