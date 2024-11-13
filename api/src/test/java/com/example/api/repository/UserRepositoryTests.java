package com.example.api.repository;

import com.example.api.entity.Company;
import com.example.api.entity.Consumer;
import com.example.api.entity.Gender;
import com.example.api.entity.User;
import com.example.api.entity.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.stream.IntStream;

@SpringBootTest
class UserRepositoryTests {

  @Autowired
  UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Test
  public void insertUser() {
    IntStream.rangeClosed(1, 100).forEach(i -> {
      User user;

      if (i <= 70) {
        // Consumer 생성
        user = Consumer.builder()
            .email("m" + i + "@a.a")
            .pw(passwordEncoder.encode("1"))
            .name("name" + i)
            .gender(i % 2 == 0 ? Gender.MALE : Gender.FEMALE)
            .fromSocial(false)
            .build();
        user.addUserRole(UserRole.CONSUMER);

      } else if (i <= 90) {
        // Company 생성
        user = Company.builder()
            .email("m" + i + "@a.a")
            .pw(passwordEncoder.encode("1"))
            .name("name" + i)
            .gender(i % 2 == 0 ? Gender.MALE : Gender.FEMALE)
            .fromSocial(false)
            .cName("Company" + i)
            .cNumber("123456789" + i)
            .mainProduct("Product" + i)
            .build();
        user.addUserRole(UserRole.COMPANY);

      } else {
        // Admin 생성 (User로 생성하고 Admin 역할만 추가)
        user = User.builder()
            .email("m" + i + "@a.a")
            .pw(passwordEncoder.encode("1"))
            .name("name" + i)
            .gender(i % 2 == 0 ? Gender.MALE : Gender.FEMALE)
            .fromSocial(false)
            .build();
        user.addUserRole(UserRole.ADMIN);
      }

      // 사용자 저장
      userRepository.save(user);

      // 저장된 사용자 정보 로깅
      System.out.println("Inserted User: " + user);
    });
  }

  @Test
  public void encryptExistingPasswords() {
    List<User> users = userRepository.findAll();

    users.forEach(user -> {
      // 평문 비밀번호인 경우만 암호화
      if (!user.getPw().startsWith("$2a$")) {
        String encodedPassword = passwordEncoder.encode(user.getPw());
        user.setPw(encodedPassword);
        userRepository.save(user);
      }
    });
  }
}
