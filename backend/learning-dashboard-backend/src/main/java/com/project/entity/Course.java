package com.project.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String courseName;

    private String instructor;

    private Integer progress;

    private String status;

    private Integer completedModules;

    private Integer totalModules;

    private Integer averageScore;

    private Double studyHours;

    private String lastActivity;

    private Integer streakDays;

    // CONSTRUCTOR

    public Course() {
    }

    // ID

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // COURSE NAME

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(
            String courseName) {

        this.courseName = courseName;
    }

    // INSTRUCTOR

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(
            String instructor) {

        this.instructor = instructor;
    }

    // PROGRESS

    public int getProgress() {
        return progress == null
                ? 0
                : progress;
    }

    public void setProgress(
            int progress) {

        this.progress = progress;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(
            String status) {

        this.status = status;
    }

    public int getCompletedModules() {
        return completedModules == null
                ? 0
                : completedModules;
    }

    public void setCompletedModules(
            int completedModules) {

        this.completedModules = completedModules;
    }

    public int getTotalModules() {
        return totalModules == null
                ? 10
                : totalModules;
    }

    public void setTotalModules(
            int totalModules) {

        this.totalModules = totalModules;
    }

    public int getAverageScore() {
        return averageScore == null
                ? 0
                : averageScore;
    }

    public void setAverageScore(
            int averageScore) {

        this.averageScore = averageScore;
    }

    public double getStudyHours() {
        return studyHours == null
                ? 0
                : studyHours;
    }

    public void setStudyHours(
            double studyHours) {

        this.studyHours = studyHours;
    }

    public String getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(
            String lastActivity) {

        this.lastActivity = lastActivity;
    }

    public int getStreakDays() {
        return streakDays == null
                ? 0
                : streakDays;
    }

    public void setStreakDays(
            int streakDays) {

        this.streakDays = streakDays;
    }
}
