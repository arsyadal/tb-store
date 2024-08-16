import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/login", { email, password })
      .then((response) => {
        console.log("Login successful:", response);
        setAlert({ type: "success", message: "Login successful!", visible: true });
        // Redirect to items list or dashboard
        setTimeout(() => {
          navigate("/items");
        }, 2000); // Redirect after 2 seconds
      })
      .catch((error) => {
        console.error("There was an error logging in!", error);
        setAlert({ type: "danger", message: "There was an error logging in!", visible: true });
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Login</h2>
      {alert.visible && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
