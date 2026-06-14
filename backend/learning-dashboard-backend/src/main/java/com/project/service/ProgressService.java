package com.project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.entity.Progress;
import com.project.repository.ProgressRepository;

@Service
public class ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    public Progress saveProgress(Progress progress) {

        double percentage =
                ((double) progress.getCompletedModules()
                / progress.getTotalModules()) * 100;

        progress.setProgressPercentage(percentage);

        return progressRepository.save(progress);
    }

    public List<Progress> getAllProgress() {
        return progressRepository.findAll();
    }
}