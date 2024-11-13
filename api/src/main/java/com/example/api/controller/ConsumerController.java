// ConsumerController.java

package com.example.api.controller;

import com.example.api.dto.ConsumerDTO;
import com.example.api.dto.ReviewDTO;
import com.example.api.entity.Review;
import com.example.api.service.ConsumerService;
import com.example.api.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consumer")
@RequiredArgsConstructor
public class ConsumerController {

  private final ConsumerService consumerService;
  private final ReviewService reviewService; // ReviewService 주입 추가

  @PostMapping("/join")
  public ResponseEntity<Long> registerConsumer(@RequestBody ConsumerDTO consumerDTO) {
    // 소비자 등록
    return new ResponseEntity<>(consumerService.registerConsumer(consumerDTO), HttpStatus.OK);
  }

  //로그인된 사용자가 자신의 uno로 마이페이지에 접근할 수 있도록 수정
  @GetMapping("/{uno}")
  public ResponseEntity<ConsumerDTO> getConsumer(@PathVariable Long uno, @RequestHeader("Authorization") String token) {
    if (!consumerService.isAuthorizedUser(uno, token)) {
      return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
    ConsumerDTO consumer = consumerService.getConsumer(uno);
    return new ResponseEntity<>(consumer, HttpStatus.OK);
  }

  @PutMapping("/consumer/{uno}")
  @PreAuthorize("hasRole('CONSUMER')")
  public ResponseEntity<Long> updateConsumer(
      @PathVariable Long uno,
      @RequestBody ConsumerDTO consumerDTO,
      @RequestHeader("Authorization") String token) {
    if (!consumerService.isAuthorizedUser(uno, token)) { // 권한 검증
      return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
    consumerDTO.setUno(uno);
    return new ResponseEntity<>(consumerService.updateConsumer(consumerDTO), HttpStatus.OK);
  }

  @DeleteMapping("/{uno}")
  public ResponseEntity<Void> removeConsumer(
      @PathVariable Long uno,
      @RequestHeader("Authorization") String token) {
    if (!consumerService.isAuthorizedUser(uno, token)) { // 권한 검증
      return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
    consumerService.removeConsumer(uno);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  @GetMapping("/{uno}/review")
  public ResponseEntity<List<ReviewDTO>> getReviewByConsumer(
      @PathVariable Long uno,
      @RequestHeader("Authorization") String token) {
    if (!consumerService.isAuthorizedUser(uno, token)) { // 권한 검증
      return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
    List<ReviewDTO> review = consumerService.getReviewByConsumer(uno);
    return ResponseEntity.ok(review);
  }
}
