import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const today = new Date().toISOString().slice(0, 10);

const getStatusFromProgress = (progress) => {
  if (progress >= 100) {
    return "Completed";
  }

  if (progress > 0) {
    return "In Progress";
  }

  return "Not Started";
};

function Courses() {

  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [courses, setCourses] = useState([]);

  const [courseName, setCourseName] =
    useState("");

  const [instructor, setInstructor] =
    useState("");

  // FETCH COURSES

  const fetchCourses = async () => {

    try {

      const response =
        await axios.get(
          "http://127.0.0.1:8000/courses"
        );

      // SAFE ARRAY CHECK

      setCourses(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.log(error);

      setCourses([]);
    }
  };

  useEffect(() => {

    fetchCourses();

  }, []);

  // ADD COURSE

  const handleAddCourse = async (e) => {

    e.preventDefault();

    if (
      courseName.trim() === "" ||
      instructor.trim() === ""
    ) {

      alert("Fill all fields");

      return;
    }

    try {

      await axios.post(
          "http://127.0.0.1:8000/courses",
        {
          courseName,
          instructor,
          progress: 0,
          status: "Not Started",
          completedModules: 0,
          totalModules: 10,
          averageScore: 0,
          studyHours: 0,
          lastActivity: "",
          streakDays: 0
        }
      );

      alert("Course Added Successfully");

      setCourseName("");
      setInstructor("");

      fetchCourses();

    } catch (error) {

      console.log(error);

      alert("Failed To Add Course");
    }
  };

  // DELETE COURSE

  const deleteCourse = async (id) => {

    try {

      await axios.delete(
        `http://127.0.0.1:8000/courses/${id}`
      );

      alert("Course Deleted");

      fetchCourses();

    } catch (error) {

      console.log(error);

      alert("Delete Failed");
    }
  };

  // UPDATE PROGRESS

  const updateProgress =
    async (course) => {

    const value = prompt(
      "Enter Progress %",
      course.progress
    );

    // CANCEL

    if (value === null) {

      return;
    }

    // EMPTY CHECK

    if (value.trim() === "") {

      alert("Enter valid progress");

      return;
    }

    const progress =
      parseInt(value);

    // VALIDATION

    if (
      isNaN(progress) ||
      progress < 0 ||
      progress > 100
    ) {

      alert(
        "Progress must be between 0 and 100"
      );

      return;
    }

    const totalModulesValue = prompt(
      "Enter Total Modules",
      course.totalModules || 10
    );

    if (totalModulesValue === null) {
      return;
    }

    const totalModules =
      parseInt(totalModulesValue);

    if (
      isNaN(totalModules) ||
      totalModules <= 0
    ) {

      alert("Total modules must be greater than 0");

      return;
    }

    const completedModulesValue = prompt(
      "Enter Completed Modules",
      course.completedModules ||
        Math.round((progress / 100) * totalModules)
    );

    if (completedModulesValue === null) {
      return;
    }

    const completedModules =
      parseInt(completedModulesValue);

    if (
      isNaN(completedModules) ||
      completedModules < 0 ||
      completedModules > totalModules
    ) {

      alert(
        "Completed modules must be between 0 and total modules"
      );

      return;
    }

    const scoreValue = prompt(
      "Enter Average Score %",
      course.averageScore || 0
    );

    if (scoreValue === null) {
      return;
    }

    const averageScore =
      parseInt(scoreValue);

    if (
      isNaN(averageScore) ||
      averageScore < 0 ||
      averageScore > 100
    ) {

      alert(
        "Average score must be between 0 and 100"
      );

      return;
    }

    const studyHoursValue = prompt(
      "Enter Study Hours",
      course.studyHours || 0
    );

    if (studyHoursValue === null) {
      return;
    }

    const studyHours =
      parseFloat(studyHoursValue);

    if (
      isNaN(studyHours) ||
      studyHours < 0
    ) {

      alert("Study hours must be 0 or more");

      return;
    }

    const streakValue = prompt(
      "Enter Learning Streak Days",
      course.streakDays || 0
    );

    if (streakValue === null) {
      return;
    }

    const streakDays =
      parseInt(streakValue);

    if (
      isNaN(streakDays) ||
      streakDays < 0
    ) {

      alert("Streak days must be 0 or more");

      return;
    }

    const suggestedStatus =
      averageScore < 60 && progress < 35
        ? "At Risk"
        : getStatusFromProgress(progress);

    try {

      await axios.put(
        `http://127.0.0.1:8000/courses/${course.id}`,
        {
          courseName:
            course.courseName,

          instructor:
            course.instructor,

          progress,
          status: suggestedStatus,
          completedModules,
          totalModules,
          averageScore,
          studyHours,
          lastActivity: today,
          streakDays
        }
      );

      alert("Progress Updated");

      fetchCourses();

    } catch (error) {

      console.log(error);

      alert("Update Failed");
    }
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap"
        }}
      >

        <h1>

          {role === "ADMIN"
            ? "Course Management"
            : "Learning Courses"}

        </h1>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap"
          }}
        >

          <button
            onClick={() =>
              navigate(
                role === "ADMIN"
                  ? "/admin"
                  : "/dashboard"
              )
            }
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "white",
              cursor: "pointer"
            }}
          >
            Dashboard
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

        </div>

      </div>

      {/* ADMIN FORM */}

      {role === "ADMIN" && (

        <form
          onSubmit={handleAddCourse}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            maxWidth: "400px",
            marginTop: "30px"
          }}
        >

          <input
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) =>
              setCourseName(e.target.value)
            }
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "none"
            }}
          />

          <input
            type="text"
            placeholder="Instructor"
            value={instructor}
            onChange={(e) =>
              setInstructor(e.target.value)
            }
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "none"
            }}
          />

          <button
            type="submit"
            style={{
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "white",
              cursor: "pointer"
            }}
          >

            Add Course

          </button>

        </form>

      )}

      {/* COURSE LIST */}

      <div
        style={{
          marginTop: "50px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px"
        }}
      >

        {courses.length > 0 ? (

          courses.map((course) => (

            <div
              key={course.id}
              style={{
                background:
                  "rgba(255,255,255,0.08)",
                padding: "25px",
                borderRadius: "20px"
              }}
            >

              <h2>
                {course.courseName}
              </h2>

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

              <p>
                Status:
                {" "}
                {course.status ||
                  getStatusFromProgress(
                    course.progress
                  )}
              </p>

              <p>
                Score:
                {" "}
                {course.averageScore || 0}%
              </p>

              <p>
                Modules:
                {" "}
                {course.completedModules || 0}
                /
                {course.totalModules || 10}
              </p>

              {/* STUDENT */}

              {role === "STUDENT" && (

                <button
                  onClick={() =>
                    updateProgress(course)
                  }
                  style={{
                    marginTop: "15px",
                    padding: "10px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#22c55e",
                    color: "white",
                    cursor: "pointer"
                  }}
                >

                  Update Progress

                </button>

              )}

              {/* ADMIN */}

              {role === "ADMIN" && (

                <button
                  onClick={() =>
                    deleteCourse(course.id)
                  }
                  style={{
                    marginTop: "15px",
                    padding: "10px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#ef4444",
                    color: "white",
                    cursor: "pointer"
                  }}
                >

                  Delete

                </button>

              )}

            </div>

          ))

        ) : (

          <h2>No Courses Available</h2>

        )}

      </div>

    </div>
  );
}

export default Courses;
