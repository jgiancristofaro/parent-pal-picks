
import { useState } from "react";

export const useHelpForm = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Support request submitted:", { subject, message });
    // Handle form submission
  };

  return {
    subject,
    setSubject,
    message,
    setMessage,
    handleSubmit,
  };
};
