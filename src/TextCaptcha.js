import { useState, useEffect } from "react";
import { FaSyncAlt } from "react-icons/fa"; // Font Awesome refresh icon

export default function TextCaptcha({ onInputChange }) {
  const [captcha, setCaptcha] = useState("");
  const [userInput, setUserInput] = useState("");

  // Function to generate a random CAPTCHA
  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let newCaptcha = "";
    for (let i = 0; i < 6; i++) {
      newCaptcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptcha(newCaptcha);
    setUserInput(""); // Reset input field
  };

  // Generate CAPTCHA when the component mounts
  useEffect(() => {
    generateCaptcha();
  }, []);

 // Handle user input changes
 const handleChange = (e) => {
    setUserInput(e.target.value);
    onInputChange(e.target.value, captcha);
  };

  return (
    <div className="d-flex align-items-center mb-3">
    {/* CAPTCHA Display Box */}
    <div className="captcha-box p-2 border rounded me-2">
      <strong>{captcha}</strong>
    </div>

    {/* Refresh Icon - FaSyncAlt */}
    <FaSyncAlt
      className="text-primary"
      style={{ cursor: "pointer", fontSize: "1.2rem" }}
      onClick={generateCaptcha}
    />

    {/* CAPTCHA Input Field */}
    <input
      type="text"
      className="form-control ms-2"
      placeholder="Enter CAPTCHA"
      value={userInput}
      onChange={handleChange}
      required
    />
  </div>
  );
}
