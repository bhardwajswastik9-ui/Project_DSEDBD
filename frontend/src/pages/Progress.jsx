import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const API_URL = "http://127.0.0.1:8000/courses";

const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number(value) || 0));

const getStatus = (course) => {
  if (course.status) {
    return course.status;
  }

  if (course.progress >= 100) {
    return "Completed";
  }

  if (course.progress > 0) {
    return "In Progress";
  }

  return "Not Started";
};

const statusColors = {
  Completed: "#16a34a",
  "In Progress": "#2563eb",
  "Not Started": "#f97316",
  "At Risk": "#dc2626"
};

function Progress() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(API_URL);

      setCourses(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.log(error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const analytics = useMemo(() => {
    const normalizedCourses = courses.map((course) => {
      const progress = clamp(course.progress);
      const totalModules = Number(course.totalModules) || 10;
      const completedModules =
        Number(course.completedModules) ||
        Math.round((progress / 100) * totalModules);
      const averageScore =
        Number(course.averageScore) || Math.max(50, Math.round(progress * 0.82));
      const studyHours =
        Number(course.studyHours) || Math.round((progress / 12) * 10) / 10;
      const status = getStatus({ ...course, progress });

      return {
        ...course,
        progress,
        completedModules,
        totalModules,
        averageScore: clamp(averageScore),
        studyHours,
        status,
        streakDays: Number(course.streakDays) || 0,
        lastActivity: course.lastActivity || "No activity yet"
      };
    });

    const totalCourses = normalizedCourses.length;
    const completedCourses = normalizedCourses.filter(
      (course) => course.status === "Completed"
    ).length;
    const activeCourses = normalizedCourses.filter(
      (course) => course.status === "In Progress"
    ).length;
    const atRiskCourses = normalizedCourses.filter(
      (course) =>
        course.status === "At Risk" ||
        (course.progress < 35 && course.averageScore < 60)
    ).length;
    const averageProgress = totalCourses
      ? Math.round(
          normalizedCourses.reduce(
            (sum, course) => sum + course.progress,
            0
          ) / totalCourses
        )
      : 0;
    const averageScore = totalCourses
      ? Math.round(
          normalizedCourses.reduce(
            (sum, course) => sum + course.averageScore,
            0
          ) / totalCourses
        )
      : 0;
    const totalStudyHours = normalizedCourses.reduce(
      (sum, course) => sum + course.studyHours,
      0
    );
    const completedModules = normalizedCourses.reduce(
      (sum, course) => sum + course.completedModules,
      0
    );
    const totalModules = normalizedCourses.reduce(
      (sum, course) => sum + course.totalModules,
      0
    );

    return {
      normalizedCourses,
      totalCourses,
      completedCourses,
      activeCourses,
      atRiskCourses,
      averageProgress,
      averageScore,
      totalStudyHours,
      completedModules,
      totalModules
    };
  }, [courses]);

  const statusData = [
    "Completed",
    "In Progress",
    "Not Started",
    "At Risk"
  ].map((status) => ({
    name: status,
    value: analytics.normalizedCourses.filter(
      (course) => course.status === status
    ).length
  }));

  const moduleData = analytics.normalizedCourses.map((course) => ({
    name: course.courseName,
    completed: course.completedModules,
    remaining: Math.max(course.totalModules - course.completedModules, 0)
  }));

  const performanceData = analytics.normalizedCourses.map((course) => ({
    name: course.courseName,
    progress: course.progress,
    score: course.averageScore
  }));

  const insights = [
    analytics.averageProgress >= 80
      ? "Completion momentum is strong. Keep prioritizing review sessions so the scores stay aligned with progress."
      : "Average completion is below the target. Focus on one active module at a time to raise consistency.",
    analytics.averageScore < 65
      ? "Performance is trailing completion. Add short quizzes or practice checks before marking modules complete."
      : "Scores are healthy. Learners are retaining enough to keep advancing.",
    analytics.atRiskCourses > 0
      ? `${analytics.atRiskCourses} course needs attention because progress and performance are both low.`
      : "No course is currently at risk based on the tracked behavior."
  ];

  return (
    <main className="progress-page">
      <section className="progress-header">
        <div>
          <p className="eyebrow">Learning intelligence</p>
          <h1>Progress Analytics</h1>
          <p>
            Track status, completion, performance, and learning behavior across every course.
          </p>
        </div>
        <div className="progress-actions">
          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
          <button onClick={() => navigate("/courses")}>
            Courses
          </button>
        </div>
      </section>

      {loading ? (
        <p className="empty-state">Loading progress data...</p>
      ) : (
        <>
          <section className="metric-grid">
            <article className="metric-card">
              <span>Total courses</span>
              <strong>{analytics.totalCourses}</strong>
            </article>
            <article className="metric-card">
              <span>Completed</span>
              <strong>{analytics.completedCourses}</strong>
            </article>
            <article className="metric-card">
              <span>Average completion</span>
              <strong>{analytics.averageProgress}%</strong>
            </article>
            <article className="metric-card">
              <span>Average score</span>
              <strong>{analytics.averageScore}%</strong>
            </article>
            <article className="metric-card">
              <span>Modules done</span>
              <strong>
                {analytics.completedModules}/{analytics.totalModules}
              </strong>
            </article>
            <article className="metric-card">
              <span>Study hours</span>
              <strong>{analytics.totalStudyHours.toFixed(1)}</strong>
            </article>
          </section>

          <section className="analytics-grid">
            <article className="panel">
              <div className="panel-title">
                <h2>Progress Status</h2>
                <span>{analytics.activeCourses} active</span>
              </div>
              <ResponsiveContainer width="100%" height={270}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={92}
                    paddingAngle={4}
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={statusColors[entry.name]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </article>

            <article className="panel">
              <div className="panel-title">
                <h2>Completion Levels</h2>
                <span>Modules</span>
              </div>
              <ResponsiveContainer width="100%" height={270}>
                <BarChart data={moduleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill="#16a34a" />
                  <Bar dataKey="remaining" stackId="a" fill="#64748b" />
                </BarChart>
              </ResponsiveContainer>
            </article>

            <article className="panel wide-panel">
              <div className="panel-title">
                <h2>Performance Monitoring</h2>
                <span>Progress vs score</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#f59e0b"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </article>
          </section>

          <section className="course-table panel">
            <div className="panel-title">
              <h2>Progress Summary</h2>
              <span>{analytics.normalizedCourses.length} records</span>
            </div>
            <div className="summary-table">
              {analytics.normalizedCourses.map((course) => (
                <article key={course.id} className="summary-row">
                  <div>
                    <strong>{course.courseName}</strong>
                    <span>{course.instructor}</span>
                  </div>
                  <span
                    className="status-pill"
                    style={{
                      backgroundColor: `${statusColors[course.status]}22`,
                      color: statusColors[course.status]
                    }}
                  >
                    {course.status}
                  </span>
                  <span>{course.progress}% complete</span>
                  <span>{course.averageScore}% score</span>
                  <span>
                    {course.completedModules}/{course.totalModules} modules
                  </span>
                  <span>{course.studyHours.toFixed(1)} hrs</span>
                </article>
              ))}
            </div>
          </section>

          <section className="insight-panel">
            <div>
              <p className="eyebrow">Behavior insights</p>
              <h2>Intelligent Recommendations</h2>
            </div>
            <div className="insight-list">
              {insights.map((insight) => (
                <p key={insight}>{insight}</p>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default Progress;
