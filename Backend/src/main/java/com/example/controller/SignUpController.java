package com.example.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.entity.SignUp;
import com.example.repo.SignUpRepo;

@RestController
@CrossOrigin
@RequestMapping("/signup")
public class SignUpController {

    @Autowired
    private SignUpRepo repo;

    // Create (POST)
    @PostMapping("/post")
    private SignUp postUser(@RequestBody SignUp user) {
        // Saving all fields correctly
        SignUp newUser = new SignUp();
        newUser.setName(user.getName());
        newUser.setUsername(user.getUsername());
        newUser.setPassword(user.getPassword());
        newUser.setConfirmPassword(user.getConfirmPassword());
        newUser.setPhoneNumber(user.getPhoneNumber());
        newUser.setEmail(user.getEmail());

        return repo.save(newUser);
    }

    // Read All (GET)
    @GetMapping("/getall")
    private List<SignUp> getAllUsers() {
        return (List<SignUp>) repo.findAll();
    }

    // Update (PUT)
    @PutMapping("/update/{id}")
    private SignUp updateUser(@PathVariable int id, @RequestBody SignUp updatedUser) {
        Optional<SignUp> existingSignUpOpt = repo.findById(id);

        if (existingSignUpOpt.isPresent()) {
            SignUp existingSignUp = existingSignUpOpt.get();

            existingSignUp.setName(updatedUser.getName());
            existingSignUp.setUsername(updatedUser.getUsername());
            existingSignUp.setPassword(updatedUser.getPassword());
            existingSignUp.setConfirmPassword(updatedUser.getConfirmPassword());
            existingSignUp.setPhoneNumber(updatedUser.getPhoneNumber());
            existingSignUp.setEmail(updatedUser.getEmail());

            return repo.save(existingSignUp);
        } else {
            throw new IllegalArgumentException("Invalid SignUp ID: " + id);
        }
    }

    // Delete (DELETE)
    @DeleteMapping("/delete/{id}")
    private void deleteUser(@PathVariable int id) {
        SignUp existingSignUp = repo.findById(id).orElse(null);
        if (existingSignUp != null) {
            repo.delete(existingSignUp);
        } else {
            throw new IllegalArgumentException("Invalid SignUp ID: " + id);
        }
    }
}
