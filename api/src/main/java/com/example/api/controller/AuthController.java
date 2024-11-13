package com.example.api.controller;

import com.example.api.dto.CompanyDTO;
import com.example.api.dto.ConsumerDTO;
import com.example.api.dto.UserDTO;
import com.example.api.security.util.JWTUtil;
import com.example.api.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Controller
@Log4j2
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8080", "http://localhost:5174"})
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

  private final UserService userService;
  private final JWTUtil jwtUtil;

  @GetMapping("/authenticationFailure")
  public void authenticationFailure() {
  }

  @GetMapping("/accessDenied")
  public void accessDenied() {
  }

  @PostMapping("/login")
  public ResponseEntity<Map<String, Object>> login(@RequestParam String email, @RequestParam String pw) {
    try {
      UserDTO userDTO = userService.loginCheck(email, pw);

      String token = jwtUtil.generateToken(userDTO.getEmail());

      Map<String, Object> response = new HashMap<>();
      response.put("token", token);
      response.put("userType", userDTO.getUserType());
      response.put("uno", userDTO.getUno());

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      log.error("로그인 오류: ", e);
      Map<String, Object> errorResponse = new HashMap<>();
      errorResponse.put("error", "로그인 실패: 이메일 또는 비밀번호를 확인하세요.");

      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }
  }
  /**
   * 2024-10-25: 기업회원/개인회원에 따라 다른 DTO로 회원 가입을 처리하도록 수정
   */
  @PostMapping("/join")
  public ResponseEntity<Long> joinUser(@RequestBody UserDTO userDTO) {
    log.info("회원가입 요청: {}", userDTO);
    log.info("DTO 수신 확인: {}", userDTO);
    if (userDTO.getCName() == null || userDTO.getCNumber() == null) {
      log.error("cName 또는 cNumber가 누락되었습니다. 전달된 값: {}", userDTO);
      System.out.println("Received cName: " + userDTO.getCName());
      System.out.println("Received cNumber: " + userDTO.getCNumber());

    }
    if ("CONSUMER".equalsIgnoreCase(userDTO.getUserType())) {
      ConsumerDTO consumerDTO = ConsumerDTO.builder()
          .uno(userDTO.getUno())
          .email(userDTO.getEmail())
          .pw(userDTO.getPw())
          .name(userDTO.getName())
          .gender(userDTO.getGender()) // 2024-10-25: gender 필드 반영
          .userType(userDTO.getUserType())
          .build();
      return ResponseEntity.ok(userService.joinConsumer(consumerDTO));
    } else if ("COMPANY".equalsIgnoreCase(userDTO.getUserType())) {
      CompanyDTO companyDTO = CompanyDTO.builder()
          .uno(userDTO.getUno())
          .email(userDTO.getEmail())
          .pw(userDTO.getPw())
          .name(userDTO.getName())
          .cName(userDTO.getCName())  // 회사 이름
          .mainProduct(userDTO.getMainProduct())  // 대표 제품
          .cNumber(userDTO.getCNumber())  // 회사 번호
          .gender(userDTO.getGender()) // 2024-10-25: gender 필드 반영
          .userType(userDTO.getUserType())
          .build();

      return ResponseEntity.ok(userService.joinCompany(companyDTO));


    } else if ("ADMIN".equalsIgnoreCase(userDTO.getUserType())) {
      return ResponseEntity.ok(userService.joinAdmin(userDTO));
    }

    return ResponseEntity.badRequest().build();
  }
}
