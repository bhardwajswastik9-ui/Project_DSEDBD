import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GATEWAY_URL } from "../services/api";
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


const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number(value) || 0));

const statusColors = {
  Completed: "#16a34a",
  "In Progress": "#2563eb",
  "Not Started": "#f97316",
  "At Risk": "#dc2626"
};

function Progress() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // State
  const [courses, setCourses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formStudentName, setFormStudentName] = useState("Active Learner");
  const [formCourseName, setFormCourseName] = useState("");
  const [formCompletedModules, setFormCompletedModules] = useState(0);
  const [formTotalModules, setFormTotalModules] = useState(10);
  const [formAverageScore, setFormAverageScore] = useState(0);
  const [formStudyHours, setFormStudyHours] = useState(0);
  const [formStreakDays, setFormStreakDays] = useState(0);
  const [formNotes, setFormNotes] = useState("");
  const [formStatus, setFormStatus] = useState("In Progress");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Courses (PostgreSQL via Gateway)
      const coursesRes = await axios.get(`${GATEWAY_URL}/courses`);
      const fetchedCourses = Array.isArray(coursesRes.data) ? coursesRes.data : [];
      setCourses(fetchedCourses);

      // Set default course name in form if courses exist
      if (fetchedCourses.length > 0) {
        setFormCourseName(fetchedCourses[0].courseName);
      }

      // Fetch Study Logs (MongoDB via Gateway)
      const logsRes = await axios.get(`${GATEWAY_URL}/api/progress`);
      setLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Log
  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!formCourseName) {
      alert("Please select or specify a course");
      return;
    }

    try {
      const payload = {
        studentName: formStudentName,
        courseName: formCourseName,
        completedModules: Number(formCompletedModules),
        totalModules: Number(formTotalModules),
        averageScore: Number(formAverageScore),
        studyHours: Number(formStudyHours),
        streakDays: Number(formStreakDays),
        notes: formNotes,
        status: formStatus,
      };

      await axios.post(`${GATEWAY_URL}/api/progress`, payload);
      alert("Study log saved to MongoDB successfully!");
      
      // Reset Form fields except student name
      setFormCompletedModules(0);
      setFormTotalModules(10);
      setFormAverageScore(0);
      setFormStudyHours(0);
      setFormStreakDays(0);
      setFormNotes("");
      setFormStatus("In Progress");

      // Refetch Logs
      const logsRes = await axios.get(`${GATEWAY_URL}/api/progress`);
      setLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
    } catch (error) {
      console.error("Error adding log:", error);
      alert("Failed to save study log to MongoDB");
    }
  };

  // Handle Delete Log
  const handleDeleteLog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this study log?")) {
      return;
    }
    try {
      await axios.delete(`${GATEWAY_URL}/api/progress/${id}`);
      alert("Study log deleted successfully");
      // Refetch Logs
      const logsRes = await axios.get(`${GATEWAY_URL}/api/progress`);
      setLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
    } catch (error) {
      console.error("Error deleting log:", error);
      alert("Failed to delete study log");
    }
  };

  // Derived Analytics from MongoDB Logs
  const analytics = useMemo(() => {
    const totalLogs = logs.length;
    
    // Sums
    const totalStudyHours = logs.reduce((sum, log) => sum + (Number(log.studyHours) || 0), 0);
    const completedModules = logs.reduce((sum, log) => sum + (Number(log.completedModules) || 0), 0);
    const totalModules = logs.reduce((sum, log) => sum + (Number(log.totalModules) || 0), 0);
    const maxStreak = logs.reduce((max, log) => Math.max(max, Number(log.streakDays) || 0), 0);

    // Averages
    const averageScore = totalLogs
      ? Math.round(logs.reduce((sum, log) => sum + (Number(log.averageScore) || 0), 0) / totalLogs)
      : 0;

    const averageProgress = totalLogs
      ? Math.round(
          logs.reduce((sum, log) => {
            const total = Number(log.totalModules) || 10;
            const done = Number(log.completedModules) || 0;
            return sum + (done / total) * 100;
          }, 0) / totalLogs
        )
      : 0;

    // Counts by status
    const completedCoursesCount = logs.filter(log => log.status === "Completed").length;
    const activeCoursesCount = logs.filter(log => log.status === "In Progress").length;
    const atRiskCoursesCount = logs.filter(log => log.status === "At Risk").length;

    return {
      totalLogs,
      totalStudyHours,
      completedModules,
      totalModules,
      maxStreak,
      averageScore,
      averageProgress,
      completedCoursesCount,
      activeCoursesCount,
      atRiskCoursesCount
    };
  }, [logs]);

  // Chart Data preparation
  const statusData = useMemo(() => {
    return ["Completed", "In Progress", "Not Started", "At Risk"].map((status) => ({
      name: status,
      value: logs.filter((log) => log.status === status).length
    }));
  }, [logs]);

  const moduleData = useMemo(() => {
    // Take the latest 8 logs to avoid cluttering the bar chart
    return logs.slice(0, 8).map((log) => ({
      name: log.courseName.length > 15 ? log.courseName.substring(0, 15) + "..." : log.courseName,
      completed: log.completedModules,
      remaining: Math.max(log.totalModules - log.completedModules, 0)
    })).reverse();
  }, [logs]);

  const performanceData = useMemo(() => {
    // Take the latest 8 logs
    return logs.slice(0, 8).map((log) => {
      const progress = Math.round((log.completedModules / log.totalModules) * 100);
      return {
        name: new Date(log.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        progress,
        score: log.averageScore
      };
    }).reverse();
  }, [logs]);

  const insights = useMemo(() => {
    return [
      analytics.averageProgress >= 80
        ? "Completion momentum is strong. Keep prioritizing review sessions so the scores stay aligned with progress."
        : "Average completion is below the target. Focus on one active module at a time to raise consistency.",
      analytics.averageScore < 65
        ? "Performance is trailing completion. Add short quizzes or practice checks before marking modules complete."
        : "Scores are healthy. Learners are retaining enough to keep advancing.",
      analytics.atRiskCoursesCount > 0
        ? `${analytics.atRiskCoursesCount} sessions have been marked 'At Risk'. High priority intervention is recommended.`
        : "No active sessions are currently marked 'At Risk' based on behavior logs."
    ];
  }, [analytics]);

  return (
    <main className="progress-page">
      <section className="progress-header">
        <div>
          <p className="eyebrow">Learning intelligence (MongoDB + Node.js Enabled)</p>
          <h1>Progress Analytics</h1>
          <p>
            Track completion, scores, study hours, and streak milestones stored securely in MongoDB.
          </p>
        </div>
        <div className="progress-actions">
          <button onClick={() => navigate(role === "ADMIN" ? "/admin" : "/dashboard")}>
            Dashboard
          </button>
          <button onClick={() => navigate("/courses")}>
            Courses
          </button>
        </div>
      </section>

      {loading ? (
        <p className="empty-state">Loading intelligence data...</p>
      ) : (
        <>
          {/* Form to log study session (MongoDB) */}
          <section className="panel" style={{ marginBottom: "24px" }}>
            <div className="panel-title">
              <h2>Log Study Session to MongoDB</h2>
              <span>New Record</span>
            </div>
            <form onSubmit={handleAddLog}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="student-name">Student Name</label>
                  <input
                    id="student-name"
                    type="text"
                    className="form-control"
                    value={formStudentName}
                    onChange={(e) => setFormStudentName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="course-select">Select Course</label>
                  <select
                    id="course-select"
                    className="form-control"
                    value={formCourseName}
                    onChange={(e) => setFormCourseName(e.target.value)}
                    required
                  >
                    {courses.length > 0 ? (
                      courses.map((c) => (
                        <option key={c.id} value={c.courseName}>
                          {c.courseName}
                        </option>
                      ))
                    ) : (
                      <option value="">-- No Courses Created --</option>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="completed-modules">Completed Modules</label>
                  <input
                    id="completed-modules"
                    type="number"
                    min="0"
                    max={formTotalModules}
                    className="form-control"
                    value={formCompletedModules}
                    onChange={(e) => setFormCompletedModules(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="total-modules">Total Modules</label>
                  <input
                    id="total-modules"
                    type="number"
                    min="1"
                    className="form-control"
                    value={formTotalModules}
                    onChange={(e) => setFormTotalModules(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="average-score">Average Score %</label>
                  <input
                    id="average-score"
                    type="number"
                    min="0"
                    max="100"
                    className="form-control"
                    value={formAverageScore}
                    onChange={(e) => setFormAverageScore(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="study-hours">Study Hours</label>
                  <input
                    id="study-hours"
                    type="number"
                    step="0.1"
                    min="0"
                    className="form-control"
                    value={formStudyHours}
                    onChange={(e) => setFormStudyHours(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="streak-days">Streak Days</label>
                  <input
                    id="streak-days"
                    type="number"
                    min="0"
                    className="form-control"
                    value={formStreakDays}
                    onChange={(e) => setFormStreakDays(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="log-status">Status</label>
                  <select
                    id="log-status"
                    className="form-control"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    required
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Not Started">Not Started</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor="log-notes">Session Notes / Insights</label>
                  <input
                    id="log-notes"
                    type="text"
                    placeholder="Enter what you learned, difficulties, or progress notes..."
                    className="form-control"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                  />
                </div>

                <button type="submit" className="form-btn">
                  Save Study Log to MongoDB
                </button>
              </div>
            </form>
          </section>

          {/* Metric Grid */}
          <section className="metric-grid">
            <article className="metric-card">
              <span>Total Logs (MongoDB)</span>
              <strong>{analytics.totalLogs}</strong>
            </article>
            <article className="metric-card">
              <span>Completed Sessions</span>
              <strong>{analytics.completedCoursesCount}</strong>
            </article>
            <article className="metric-card">
              <span>Average Completion</span>
              <strong>{analytics.averageProgress}%</strong>
            </article>
            <article className="metric-card">
              <span>Average Score</span>
              <strong>{analytics.averageScore}%</strong>
            </article>
            <article className="metric-card">
              <span>Total Study Hours</span>
              <strong>{analytics.totalStudyHours.toFixed(1)} hrs</strong>
            </article>
            <article className="metric-card">
              <span>Max Streak Milestone</span>
              <strong>{analytics.maxStreak} Days</strong>
            </article>
          </section>

          {/* Charts */}
          {logs.length > 0 ? (
            <section className="analytics-grid">
              <article className="panel">
                <div className="panel-title">
                  <h2>Progress Status</h2>
                  <span>{analytics.activeCoursesCount} active sessions</span>
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
                          fill={statusColors[entry.name] || "#64748b"}
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
                  <h2>Completion Levels (Latest Logs)</h2>
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
                  <h2>Performance Timeline (Latest logs)</h2>
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
          ) : (
            <div className="panel" style={{ textAlign: "center", padding: "40px 0", marginBottom: "18px" }}>
              <h3>No Study Log History Found in MongoDB</h3>
              <p style={{ color: "#94a3b8", marginTop: "10px" }}>Log a study session using the form above to visualize progress charts.</p>
            </div>
          )}

          {/* Historical Logs List (MongoDB) */}
          <section className="course-table panel">
            <div className="panel-title">
              <h2>Study Session Logs (MongoDB)</h2>
              <span>{logs.length} entries</span>
            </div>
            <div className="summary-table">
              {logs.length > 0 ? (
                logs.map((log) => {
                  const logProgress = Math.round((log.completedModules / log.totalModules) * 100);
                  return (
                    <article key={log._id} className="summary-row">
                      <div>
                        <strong>{log.courseName}</strong>
                        <span>Learner: {log.studentName}</span>
                      </div>
                      <span
                        className="status-pill"
                        style={{
                          backgroundColor: `${statusColors[log.status] || "#64748b"}22`,
                          color: statusColors[log.status] || "#f8fafc"
                        }}
                      >
                        {log.status}
                      </span>
                      <span>{logProgress}% complete</span>
                      <span>{log.averageScore}% score</span>
                      <span>
                        {log.completedModules}/{log.totalModules} modules
                      </span>
                      <span>{log.studyHours.toFixed(1)} hrs</span>
                      <div>
                        <span style={{ fontSize: "12px", fontStyle: "italic" }}>
                          {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                        {log.notes && (
                          <span style={{ fontSize: "11px", color: "#64748b", maxWidth: "200px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} title={log.notes}>
                            Note: {log.notes}
                          </span>
                        )}
                      </div>
                      <button
                        className="btn-delete-log"
                        onClick={() => handleDeleteLog(log._id)}
                        title="Delete this study log from MongoDB"
                      >
                        🗑️
                      </button>
                    </article>
                  );
                })
              ) : (
                <p style={{ textAlign: "center", color: "#94a3b8", padding: "20px 0" }}>
                  No study logs recorded yet. Use the form above to add your first session.
                </p>
              )}
            </div>
          </section>

          {/* Insights (MongoDB analytics-based) */}
          <section className="insight-panel">
            <div>
              <p className="eyebrow">Behavior insights</p>
              <h2>Intelligent Recommendations</h2>
            </div>
            <div className="insight-list">
              {insights.map((insight, idx) => (
                <p key={idx}>{insight}</p>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default Progress;
