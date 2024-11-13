package com.example.api.repository;

import com.example.api.entity.Consumer;
import com.example.api.entity.Review;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ConsumerRepository extends JpaRepository<Consumer, Long> {

  @EntityGraph(attributePaths = {"roleSet"}, type = EntityGraph.EntityGraphType.LOAD)
  @Query("SELECT u FROM User u WHERE u.email = :email")
  Optional<Consumer> findByEmail(String email);

}
