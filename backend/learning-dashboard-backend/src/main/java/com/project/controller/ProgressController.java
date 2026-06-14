package com.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.project.entity.Progress;
import com.project.service.ProgressService;

@RestController
@RequestMapping("/progress")
@CrossOrigin("*")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @PostMapping("/add")
    public Progress addProgress(@RequestBody Progress progress) {
        return progressService.saveProgress(progress);
    }

    @GetMapping
    public List<Progress> getAllProgress() {
        return progressService.getAllProgress();
    }
}