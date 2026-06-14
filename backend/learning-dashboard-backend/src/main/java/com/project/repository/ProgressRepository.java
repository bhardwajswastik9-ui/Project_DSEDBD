package com.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entity.Progress;

public interface ProgressRepository extends JpaRepository<Progress, Long> {

}