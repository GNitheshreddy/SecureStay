package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.entity.SignUp;
import com.example.repo.SignUpRepo;

@Service
public class SignUpService {

    @Autowired
    SignUpRepo repo;

    public Iterable<SignUp> GetAll() {
        return repo.findAll();
    }

    public SignUp saveUser(SignUp user) {
        return repo.save(user);
    }

    public void deleteUser(int id) {
        repo.deleteById(id);
    }
}
