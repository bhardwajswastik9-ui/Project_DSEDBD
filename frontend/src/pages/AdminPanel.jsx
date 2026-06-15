import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";
import { GATEWAY_URL } from "../services/api";

import {
  useNavigate
} from "react-router-dom";

function AdminPanel() {

  const navigate = useNavigate();

  const [courses, setCourses] =
    useState([]);

  useEffect(() => {

    const role =
      localStorage.getItem("role");

    if (role !== "ADMIN") {

      navigate("/dashboard");
    }

    fetchCourses();

  }, []);

  const fetchCourses =
    async () => {

    try {

      const response =
        await axios.get(
          `${GATEWAY_URL}/courses`
        );

      setCourses(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  // LOGOUT

  const handleLogout = () => {

    localStorage.clear();

    navigate("/");
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px"
      }}
    >

      {/* TOP BAR */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >

        <h1>
          Admin Panel 👨‍💻
        </h1>

        <button
          onClick={handleLogout}
          style={{
            padding: "12px 22px",
            border: "none",
            borderRadius: "10px",
            background: "#ef4444",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>

      </div>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginTop: "40px"
        }}
      >

        {/* CARD */}

        <div
          style={{
            background:
              "rgba(255,255,255,0.08)",
            padding: "30px",
            borderRadius: "20px"
          }}
        >

          <h2>
            {courses.length}
          </h2>

          <p>
            Total Courses
          </p>

        </div>

        {/* CARD */}

        <div
          style={{
            background:
              "rgba(255,255,255,0.08)",
            padding: "30px",
            borderRadius: "20px"
          }}
        >

          <h2>
            ADMIN
          </h2>

          <p>
            System Role
          </p>

        </div>

        {/* CARD */}

        <div
          style={{
            background:
              "rgba(255,255,255,0.08)",
            padding: "30px",
            borderRadius: "20px"
          }}
        >

          <h2>
            ACTIVE
          </h2>

          <p>
            Server Status
          </p>

        </div>

      </div>

      {/* ACTIONS */}

      <div
        style={{
          marginTop: "50px",
          background:
            "rgba(255,255,255,0.08)",
          padding: "30px",
          borderRadius: "20px"
        }}
      >

        <h2>
          Admin Controls
        </h2>

        <p>
          Manage platform resources professionally 🚀
        </p>

        <button
          onClick={() =>
            navigate("/courses")
          }
          style={{
            marginTop: "20px",
            padding: "14px 25px",
            border: "none",
            borderRadius: "10px",
            background: "#2563eb",
            color: "white",
            cursor: "pointer"
          }}
        >

          Manage Courses

        </button>

      </div>

    </div>
  );
}

export default AdminPanel;