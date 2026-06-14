package com.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.project.entity.Course;
import com.project.repository.CourseRepository;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    // GET ALL COURSES

    @GetMapping
    public List<Course> getAllCourses() {

        return courseRepository.findAll();
    }

    // ADD COURSE

    @PostMapping
    public Course addCourse(
            @RequestBody Course course) {

        return courseRepository.save(course);
    }

    // UPDATE COURSE

    @PutMapping("/{id}")
    public Course updateCourse(
            @PathVariable Long id,
            @RequestBody Course updatedCourse) {

        Course course =
                courseRepository.findById(id)
                .orElseThrow();

        course.setCourseName(
                updatedCourse.getCourseName());

        course.setInstructor(
                updatedCourse.getInstructor());

        course.setProgress(
                updatedCourse.getProgress());

        course.setStatus(
                updatedCourse.getStatus());

        course.setCompletedModules(
                updatedCourse.getCompletedModules());

        course.setTotalModules(
                updatedCourse.getTotalModules());

        course.setAverageScore(
                updatedCourse.getAverageScore());

        course.setStudyHours(
                updatedCourse.getStudyHours());

        course.setLastActivity(
                updatedCourse.getLastActivity());

        course.setStreakDays(
                updatedCourse.getStreakDays());

        return courseRepository.save(course);
    }

    // DELETE COURSE

    @DeleteMapping("/{id}")
    public String deleteCourse(
            @PathVariable Long id) {

        courseRepository.deleteById(id);

        return "Course Deleted";
    }
}
