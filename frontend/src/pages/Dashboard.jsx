import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const [courses, setCourses] =
    useState([]);

  const role =
    localStorage.getItem("role");

  // FETCH COURSES

  useEffect(() => {

    axios.get(
      "http://127.0.0.1:8000/courses"
    )
    .then((response) => {

      setCourses(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    })
    .catch((error) => {

      console.log(error);

      setCourses([]);
    });

  }, []);

  // LOGOUT

  const handleLogout = () => {

    localStorage.clear();

    navigate("/");
  };

  // ANALYTICS

  const totalCourses =
    courses.length;

  const completedCourses =
    courses.filter(
      (course) =>
        course.progress >= 100
    ).length;

  const averageProgress =
    totalCourses > 0
      ? Math.round(
          courses.reduce(
            (sum, course) =>
              sum + course.progress,
            0
          ) / totalCourses
        )
      : 0;

  let insight =
    "Keep learning consistently 🚀";

  if (averageProgress >= 80) {

    insight =
      "Excellent Performance";

  } else if (
    averageProgress >= 50
  ) {

    insight =
      "Good Progress";

  } else {

    insight =
      "Need More Focus";
  }

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px"
      }}
    >

      {/* TOP */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between"
        }}
      >

        <h1>
          Learning Progress Dashboard 🚀
        </h1>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap"
          }}
        >

          <button
            onClick={() => navigate("/courses")}
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "white",
              cursor: "pointer"
            }}
          >
            Courses
          </button>

          <button
            onClick={() => navigate("/progress")}
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: "8px",
              background: "#16a34a",
              color: "white",
              cursor: "pointer"
            }}
          >
            Progress
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#ef4444",
              color: "white",
              cursor: "pointer"
            }}
          >
            Logout
          </button>

        </div>

      </div>

      {/* CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginTop: "40px"
        }}
      >

        <div
          style={{
            background:
              "rgba(255,255,255,0.08)",
            padding: "25px",
            borderRadius: "20px"
          }}
        >

          <h2>
            {totalCourses}
          </h2>

          <p>
            Total Courses
          </p>

        </div>

        <div
          style={{
            background:
              "rgba(255,255,255,0.08)",
            padding: "25px",
            borderRadius: "20px"
          }}
        >

          <h2>
            {completedCourses}
          </h2>

          <p>
            Completed Courses
          </p>

        </div>

        <div
          style={{
            background:
              "rgba(255,255,255,0.08)",
            padding: "25px",
            borderRadius: "20px"
          }}
        >

          <h2>
            {averageProgress}%
          </h2>

          <p>
            Average Progress
          </p>

        </div>

      </div>

      {/* COURSES */}

      <div
        style={{
          marginTop: "50px"
        }}
      >

        <h2>
          Course Progress 📚
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginTop: "20px"
          }}
        >

          {courses.map((course) => (

            <div
              key={course.id}
              style={{
                background:
                  "rgba(255,255,255,0.08)",
                padding: "20px",
                borderRadius: "20px"
              }}
            >

              <h3>
                {course.courseName}
              </h3>

              <p>
                Instructor:
                {" "}
                {course.instructor}
              </p>

              <p>
                Progress:
                {" "}
                {course.progress}%
              </p>

              {/* PROGRESS BAR */}

              <div
                style={{
                  width: "100%",
                  height: "12px",
                  background:
                    "#1e293b",
                  borderRadius: "10px",
                  marginTop: "10px"
                }}
              >

                <div
                  style={{
                    width:
                      `${course.progress}%`,
                    height: "100%",
                    background:
                      "#22c55e",
                    borderRadius: "10px"
                  }}
                ></div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* SUMMARY */}

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
          Performance Summary 📊
        </h2>

        <p>
          Completed
          {" "}
          {completedCourses}
          {" "}
          out of
          {" "}
          {totalCourses}
          {" "}
          courses.
        </p>

        <p>
          Average Progress:
          {" "}
          {averageProgress}%
        </p>

      </div>

      {/* INSIGHTS */}

      <div
        style={{
          marginTop: "30px",
          background:
            "rgba(34,197,94,0.1)",
          padding: "30px",
          borderRadius: "20px"
        }}
      >

        <h2>
          Intelligent Insights 🤖
        </h2>

        <p>
          {insight}
        </p>

      </div>

    </div>
  );
}

export default Dashboard;
