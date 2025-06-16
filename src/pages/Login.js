import { useState } from "react";
import { Form, Button, FloatingLabel, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import tr_map from "../assets/tripura.png"; // Import logo
import TextCaptcha from "../TextCaptcha"; // Import CAPTCHA component

export default function Login() {
  const [form, setForm] = useState({ empemail: "", user_password: "" });
  const [error, setError] = useState("");
  const [captchaError, setCaptchaError] = useState(""); // Error message for CAPTCHA
  const [userCaptcha, setUserCaptcha] = useState(""); // Stores user input
  const [generatedCaptcha, setGeneratedCaptcha] = useState(""); // Stores generated CAPTCHA
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Captcha validation function
  const handleCaptchaInput = (input, generated) => {
    setUserCaptcha(input);
    setGeneratedCaptcha(generated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate CAPTCHA on form submit
    if (userCaptcha !== generatedCaptcha) {
      setCaptchaError("CAPTCHA does not match. Try again.");
      return;
    } else {
      setCaptchaError(""); // Clear error if correct
    }

    try {
      const res = await axios.post("http://localhost:8096/api/login", form);
      localStorage.setItem("token", res.data.token); // Save token
      localStorage.setItem("role", res.data.role); // Save role
      navigate("/dashboard"); // Redirect after login
    } catch (err) {
      alert(err);
      setError("Invalid email or password.");
    }
  };

  return (
    <section className="vh-50">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card">
              <div className="row g-0">
                {/* Left side - Image */}
                <div className="col-md-6 col-lg-5 d-none d-md-block" style={{ backgroundColor: "#333" }}>
                  <img src={tr_map} alt="login form" className="img-fluid" />
                </div>

                {/* Right side - Form */}
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <div className="text-center">
                      <h2 className="mb-4">Nodal Officer Login</h2>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                      <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                        <Form.Control
                          type="email"
                          name="empemail"
                          placeholder="name@example.com"
                          onChange={handleChange}
                          required
                        />
                      </FloatingLabel>

                      <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                        <Form.Control
                          type="password"
                          name="user_password"
                          placeholder="Password"
                          onChange={handleChange}
                          required
                        />
                      </FloatingLabel>

                      {/* CAPTCHA Component */}
                      <TextCaptcha onInputChange={handleCaptchaInput} />
                      {captchaError && <Alert variant="danger">{captchaError}</Alert>}

                      <Button variant="primary" type="submit" className="mt-2">
                        Submit
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
