package com.example.repo;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.SignUp;

@Repository
public interface SignUpRepo extends CrudRepository<SignUp, Integer> {

    @Query("SELECT s FROM SignUp s WHERE s.username = ?1")
    Iterable<SignUp> findByUsername(String username);

}
