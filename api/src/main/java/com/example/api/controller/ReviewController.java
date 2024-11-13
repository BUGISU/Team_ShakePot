package com.example.api.controller;

import com.example.api.dto.ReviewDTO;
import com.example.api.entity.Review;
import com.example.api.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/review")
public class ReviewController {
  private final ReviewService reviewService;

  @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<List<ReviewDTO>> getAllReview() {
    List<ReviewDTO> review = reviewService.getAllReview();
    if (review.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    return new ResponseEntity<>(review, HttpStatus.OK);
  }

  @GetMapping(value = "/product/{pno}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<List<ReviewDTO>> getAllReviewByProduct(@PathVariable("pno") Long pno) {
    log.info("Fetching review for product PNO: {}", pno);
    List<ReviewDTO> review = reviewService.getAllReviewByProduct(pno);
    return new ResponseEntity<>(review, HttpStatus.OK);
  }

  @GetMapping(value = "/user/{uno}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<List<ReviewDTO>> getAllReviewByUser(@PathVariable("uno") Long uno) {
    log.info("Fetching review by consumer UNO: {}", uno);
    List<ReviewDTO> review = reviewService.getAllReviewByUser(uno);
    return new ResponseEntity<>(review, HttpStatus.OK);
  }

  @GetMapping(value = "/rating/{rating}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<List<ReviewDTO>> getReviewByRating(@PathVariable("rating") int rating) {
    log.info("Fetching review with rating >= {}", rating);
    List<ReviewDTO> review = reviewService.getReviewByRating(rating);
    return new ResponseEntity<>(review, HttpStatus.OK);
  }

  @PostMapping("/register")
  public ResponseEntity<?> registerReview(@RequestBody ReviewDTO reviewDto) {
    log.info("Received review registration request:");
    log.info("Consumer ID (consumer_id): {}", reviewDto.getConsumer_id());
    log.info("Product ID (pno): {}", reviewDto.getPno());
    log.info("Review Content (rContent): {}", reviewDto.getRContent());
    log.info("Rating: {}", reviewDto.getRating());

//    if (reviewDto.getConsumer_id() == null || reviewDto.getPno() == null || reviewDto.getRContent() == null) {
//      throw new IllegalArgumentException("Required fields are missing.");
//    }
    reviewService.reviewregister(reviewDto);
    return ResponseEntity.ok("Review registered successfully.");
  }

  @PutMapping("/{rno}")
  public ResponseEntity<Void> reviewmodify(@PathVariable Long rno, @RequestBody ReviewDTO reviewDTO) {
    log.info("Updating review RNO: {}", rno);
    reviewDTO.setRno(rno);
    reviewService.reviewmodify(reviewDTO);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @DeleteMapping("/{rno}")
  public ResponseEntity<Void> reviewdelete(@PathVariable Long rno) {
    log.info("Deleting review RNO: {}", rno);
    reviewService.reviewdelete(rno);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
  // 리뷰 내용 및 평점 업데이트
  @PutMapping("/update/{rno}")
  public ResponseEntity<Void> updateReviewContentAndRating(
      @PathVariable Long rno,
      @RequestBody ReviewDTO reviewDTO) {
    log.info("Updating review content and rating. RNO: {}", rno);
    reviewService.updateReviewContentAndRating(rno, reviewDTO.getRContent(), reviewDTO.getRating());
    return new ResponseEntity<>(HttpStatus.OK);
  }

  // 특정 사용자의 모든 리뷰 삭제
  @DeleteMapping("/user/{uno}")
  public ResponseEntity<Void> reviewdeleteByUserUno(@PathVariable Long uno) {
    log.info("Removing review by consumer UNO: {}", uno);
    reviewService.reviewdeleteByUserUno(uno);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  // 특정 제품의 모든 리뷰 삭제
  @DeleteMapping("/product/{pno}")
  public ResponseEntity<Void> reviewdeleteByProductPno(@PathVariable Long pno) {
    log.info("Removing review for product PNO: {}", pno);
    reviewService.reviewdeleteByProductPno(pno);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}