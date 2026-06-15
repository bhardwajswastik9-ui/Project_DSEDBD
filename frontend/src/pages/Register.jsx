import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GATEWAY_URL } from "../services/api";
import "./Login.css";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        `${GATEWAY_URL}/auth/register`,
        {
          name,
          email,
          password,
          role
        }
      );

      alert(response.data.message);

      navigate("/");

    } catch (error) {

      console.log(error);

      alert("Registration Failed");
    }
  };

  return (

    <div className="login-container">

      <div className="login-card">

        <h1>Create Account</h1>

        <p>Register to continue</p>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

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

          {/* ROLE */}

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "none"
            }}
          >

            <option value="STUDENT">
              STUDENT
            </option>

            <option value="ADMIN">
              ADMIN
            </option>

          </select>

          <button type="submit">
            Register
          </button>

        </form>

        <div className="register-section">

          <p>
            Already have an account?
          </p>

          <button
            className="register-btn"
            onClick={() => navigate("/")}
          >
            Back To Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;