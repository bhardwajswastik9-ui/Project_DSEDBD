import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        {
          email,
          password
        }
      );

      // VALIDATION

      if (
        !response.data.token
      ) {

        alert("Invalid Credentials");

        return;
      }

      // STORE TOKEN

      localStorage.setItem(
        "token",
        response.data.token
      );

      // STORE ROLE

      localStorage.setItem(
        "role",
        response.data.role
      );

      alert("Login Successful");

      // ROLE NAVIGATION

      if (
        response.data.role === "ADMIN"
      ) {

        navigate("/admin");

      } else {

        navigate("/dashboard");
      }

    } catch (error) {

      console.log(error);

      alert("Invalid Credentials");
    }
  };

  return (

    <div className="login-container">

      <div className="login-card">

        <h1>
          Learning Dashboard
        </h1>

        <p>
          Sign in to continue
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Login
          </button>

        </form>

        <div className="register-section">

          <p>
            Don't have an account?
          </p>

          <button
            className="register-btn"
            onClick={() =>
              navigate("/register")
            }
          >
            Register
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;