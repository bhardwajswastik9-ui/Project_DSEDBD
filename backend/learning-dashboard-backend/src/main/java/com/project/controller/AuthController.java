package com.project.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.project.dto.LoginRequest;
import com.project.dto.RegisterRequest;
import com.project.entity.User;
import com.project.jwt.JwtUtil;
import com.project.repository.UserRepository;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    // REGISTER

    @PostMapping("/register")
    public Map<String, String> register(
            @RequestBody RegisterRequest request) {

        Map<String, String> response =
                new HashMap<>();

        Optional<User> existingUser =
                userRepository.findByEmail(
                        request.getEmail());

        if (existingUser.isPresent()) {

            response.put(
                    "message",
                    "Email already exists"
            );

            return response;
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        userRepository.save(user);

        response.put(
                "message",
                "Registration Successful"
        );

        return response;
    }

    // LOGIN

    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody LoginRequest request) {

        Optional<User> existingUser =
                userRepository.findByEmail(
                        request.getEmail());

        // USER NOT FOUND

        if (existingUser.isEmpty()) {

            throw new RuntimeException(
                    "User Not Found");
        }

        User user = existingUser.get();

        // PASSWORD CHECK

        if (!user.getPassword()
                .equals(request.getPassword())) {

            throw new RuntimeException(
                    "Invalid Password");
        }

        // GENERATE TOKEN

        String token =
                jwtUtil.generateToken(
                        user.getEmail());

        Map<String, String> response =
                new HashMap<>();

        response.put("token", token);

        response.put(
                "role",
                user.getRole());

        response.put(
                "message",
                "Login Successful");

        return response;
    }
}