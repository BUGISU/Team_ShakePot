package com.example.api.controller;

import com.example.api.dto.UserDTO;
import com.example.api.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Log4j2
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;

  @PostMapping(value="/join")
  public ResponseEntity<Long> register(@RequestBody UserDTO userDTO) {
    log.info("Registering user: " + userDTO);
    Long uno = userService.registerUser(userDTO); // 메서드 이름 통일
    return new ResponseEntity<>(uno, HttpStatus.OK);
  }

  @GetMapping(value = "/{uno}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<UserDTO> read(@PathVariable("uno") Long uno) {
    log.info("Reading user with id: " + uno);
    UserDTO userDTO = userService.getUser(uno);
    return new ResponseEntity<>(userDTO, HttpStatus.OK); // 성별 포함 확인
  }
  @DeleteMapping(value = "/{uno}", produces = MediaType.TEXT_PLAIN_VALUE) // "{uno}"를 "{uno}"로 변경
  public ResponseEntity<String> remove(@PathVariable("uno") Long uno) {
    log.info("Deleting user with id: " + uno);
    userService.removeUser(uno);
    return new ResponseEntity<>("User removed", HttpStatus.OK);
  }

  @PutMapping(value = "/{uno}", produces = MediaType.TEXT_PLAIN_VALUE) // "{num}"을 "{uno}"로 변경
  public ResponseEntity<String> modify(@PathVariable("uno") Long uno, @RequestBody UserDTO userDTO) {
    log.info("Modifying user with id: " + uno + ", data: " + userDTO);
    userDTO.setUno(uno); // DTO에 사용자 ID 설정
    userService.updateUser(userDTO);
    return new ResponseEntity<>("User modified", HttpStatus.OK);
  }


  @GetMapping("/user-info")
  public ResponseEntity<UserDTO> getCurrentUser(@RequestParam String email) {
    log.info("Fetching user information for email: {}", email);
    UserDTO userDTO = userService.getUserByEmail(email);
    log.info("Retrieved user data: {}", userDTO);
    return ResponseEntity.ok(userDTO);
  }
}