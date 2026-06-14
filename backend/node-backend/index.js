const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/learning_dashboard";

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// CONNECT TO MONGODB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// SCHEMA DESIGN
const studyLogSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  courseName: { type: String, required: true },
  completedModules: { type: Number, default: 0 },
  totalModules: { type: Number, default: 10 },
  averageScore: { type: Number, default: 0 },
  studyHours: { type: Number, default: 0 },
  notes: { type: String, default: "" },
  streakDays: { type: Number, default: 0 },
  status: { type: String, default: "In Progress" },
  timestamp: { type: Date, default: Date.now },
});

const StudyLog = mongoose.model("StudyLog", studyLogSchema);

// -----------------------------------
// REST CRUD APIs
// -----------------------------------

// GET ALL LOGS
app.get("/api/progress", async (req, res) => {
  try {
    const logs = await StudyLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch study logs" });
  }
});

// ADD NEW LOG
app.post("/api/progress", async (req, res) => {
  try {
    const {
      studentName,
      courseName,
      completedModules,
      totalModules,
      averageScore,
      studyHours,
      notes,
      streakDays,
      status,
    } = req.body;

    const newLog = new StudyLog({
      studentName,
      courseName,
      completedModules: Number(completedModules) || 0,
      totalModules: Number(totalModules) || 10,
      averageScore: Number(averageScore) || 0,
      studyHours: Number(studyHours) || 0,
      notes: notes || "",
      streakDays: Number(streakDays) || 0,
      status: status || "In Progress",
    });

    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(400).json({ error: "Failed to create study log" });
  }
});

// UPDATE LOG
app.put("/api/progress/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLog = await StudyLog.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedLog) {
      return res.status(404).json({ error: "Study log not found" });
    }
    res.json(updatedLog);
  } catch (error) {
    res.status(400).json({ error: "Failed to update study log" });
  }
});

// DELETE LOG
app.delete("/api/progress/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLog = await StudyLog.findByIdAndDelete(id);
    if (!deletedLog) {
      return res.status(404).json({ error: "Study log not found" });
    }
    res.json({ message: "Study log deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete study log" });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Node.js backend running on port ${PORT}`);
});
