
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock functionality - log credentials and navigate to home
    console.log("Email:", email);
    console.log("Password:", password);
    // Simulate successful login
    navigate("/");
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
  };
};
