package com.example.api.repository;

import com.example.api.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

  // 이메일로 사용자를 찾는 메서드
  @EntityGraph(attributePaths = {"roleSet"}, type = EntityGraph.EntityGraphType.LOAD)
  @Query("SELECT u FROM User u WHERE u.email = :email")
  Optional<User> findByEmail(String email);

  // User의 uno를 통해 이메일을 조회하는 쿼리 추가
  @Query("SELECT u.email FROM User u WHERE u.uno = :uno")
  String findEmailByUno(Long uno);

}


