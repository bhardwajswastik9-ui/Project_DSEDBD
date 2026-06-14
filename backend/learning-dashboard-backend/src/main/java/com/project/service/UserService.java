package com.project.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.dto.LoginRequest;
import com.project.entity.User;
import com.project.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // REGISTER USER
    public User registerUser(User user) {
        return userRepository.save(user);
    }

    // GET ALL USERS
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // LOGIN USER
    public String loginUser(LoginRequest request) {

        Optional<User> user =
                userRepository.findByEmail(request.getEmail());

        if (user.isPresent()) {

            if (user.get().getPassword()
                    .equals(request.getPassword())) {

                return "Login Successful";

            } else {

                return "Invalid Password";
            }
        }

        return "User Not Found";
    }
}