package com.example.api.service;

import com.example.api.dto.CompanyDTO;
import com.example.api.dto.ConsumerDTO;
import com.example.api.dto.UserDTO;
import com.example.api.entity.*;
import com.example.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  public UserDTO getUser(Long uno) {
    Optional<User> result = userRepository.findById(uno);
    return result.map(this::entityToDTO).orElse(null);
  }

  @Override
  public UserDTO loginCheck(String email, String rawPassword) {
    log.info("로그인 시도 이메일: {}", email);
    log.info("로그인 시도 비밀번호: {}", rawPassword);  // 입력된 비밀번호 확인

    Optional<User> result = userRepository.findByEmail(email);

    if (result.isPresent()) {
      User user = result.get();
      log.info("DB에서 가져온 사용자 비밀번호: {}", user.getPw());

      String storedPassword = user.getPw();
      boolean isPasswordMatch = passwordEncoder.matches(rawPassword, storedPassword);
      log.info("비밀번호 일치 여부: {}", isPasswordMatch);

      if (isPasswordMatch) {
        log.info("비밀번호가 일치합니다.");
        UserDTO userDTO = entityToDTO(user);
        log.info("UserDTO 생성 완료 - userType: {}, roleSet: {}", userDTO.getUserType(), userDTO.getRoleSet());
        return userDTO;
      } else {
        log.error("비밀번호가 일치하지 않습니다.");
        throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
      }
    }

    log.warn("해당 이메일의 사용자가 없습니다: {}", email);
    throw new UsernameNotFoundException("해당 이메일의 사용자를 찾을 수 없습니다.");
  }

  @Override
  public void removeUser(Long uno) {
    if (userRepository.existsById(uno)) {
      userRepository.deleteById(uno);
    } else {
      log.warn("Attempted to delete non-existing user with id: " + uno);
    }
  }

  @Override
  public Long updateUser(UserDTO userDTO) {
    Optional<User> result = userRepository.findById(userDTO.getUno());
    if (result.isPresent()) {
      User user = result.get();
      user.setEmail(userDTO.getEmail());
      if (userDTO.getPw() != null && !userDTO.getPw().isEmpty()) {
        // 비밀번호를 암호화하여 저장
        user.setPw(passwordEncoder.encode(userDTO.getPw()));
      }
      user.setGender(userDTO.getGender()); // 성별 업데이트 추가
      return userRepository.save(user).getUno();
    }
    return 0L;
  }

  @Override
  public Long registerUser(UserDTO userDTO) {
    userDTO.setPw(passwordEncoder.encode(userDTO.getPw()));
    return userRepository.save(dtoToEntity(userDTO)).getUno();
  }

  @Override
  public Long joinConsumer(ConsumerDTO consumerDTO) {
    Consumer consumer = new Consumer();
    consumer.setEmail(consumerDTO.getEmail());
    consumer.setPw(passwordEncoder.encode(consumerDTO.getPw()));
    consumer.setName(consumerDTO.getName());
    consumer.setGender(consumerDTO.getGender()); // 2024-10-25: gender 필드 반영
    consumer.setUserType("CONSUMER");

    return userRepository.save(consumer).getUno();
  }

  @Override
  public Long joinCompany(CompanyDTO companyDTO) {
    // User 대신 바로 Company 객체 생성
    Company company = new Company();
    company.setEmail(companyDTO.getEmail());
    company.setPw(passwordEncoder.encode(companyDTO.getPw()));
    company.setName(companyDTO.getName());
    company.setGender(companyDTO.getGender()); // 2024-10-25: gender 필드 반영
    company.setCName(companyDTO.getCName());
    company.setCNumber(companyDTO.getCNumber());
    company.setMainProduct(companyDTO.getMainProduct());

    // 회원 저장 후 uno 반환
    return userRepository.save(company).getUno();
  }
  @Override
  public Long joinAdmin(UserDTO adminDTO) {
    User user = dtoToEntity(adminDTO);
    user.getRoleSet().add(UserRole.ADMIN);  // RoleSet에 Admin 역할 추가
    user.setUserType("ADMIN");  // dtype 설정

    // 비밀번호 암호화
    user.setPw(passwordEncoder.encode(adminDTO.getPw()));

    return userRepository.save(user).getUno();  // 회원 저장 후 uno 반환
  }

  @Override
  public UserDTO entityToDTO(User user) {
    return UserDTO.builder()
        .uno(user.getUno())
        .email(user.getEmail())
        .pw(user.getPw())
        .name(user.getName())
        .fromSocial(user.isFromSocial())
        .gender(user.getGender()) // 성별 추가
        .roleSet(user.getRoleSet().stream().map(UserRole::name).collect(Collectors.toSet()))
        .userType(user.getUserType())
        .build();
  }

  @Override
  public User dtoToEntity(UserDTO userDTO) {
    User user = User.builder()
            .uno(userDTO.getUno())
            .email(userDTO.getEmail())
            .pw(userDTO.getPw())
            .name(userDTO.getName())
            .fromSocial(userDTO.isFromSocial())
            .roleSet(userDTO.getRoleSet().stream().map(role -> {
              switch (role) {
                case "ROLE_CONSUMER": return UserRole.CONSUMER;
                case "ROLE_COMPANY": return UserRole.COMPANY;
                case "ROLE_ADMIN": return UserRole.ADMIN;
                default: return UserRole.CONSUMER;
              }
            }).collect(Collectors.toSet()))
            .build();

    // Gender 값이 null이 아닌 경우만 처리
    if (userDTO.getGender() != null) {
      try {
        user.setGender(Gender.valueOf(userDTO.getGender().name()));
      } catch (IllegalArgumentException e) {
        log.warn("Invalid gender value: " + userDTO.getGender() + ". Setting default gender.");
        user.setGender(Gender.OTHER);
      }
    }

    // userType을 dtype으로 설정
    if (userDTO.getUserType() != null) {
      user.setUserType(userDTO.getUserType());
    }
    return user;
  }
  @Override
  public UserDTO getUserByEmail(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    return entityToDTO(user);
  }
}