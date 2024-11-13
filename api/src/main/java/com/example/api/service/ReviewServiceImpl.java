package com.example.api.service;

import com.example.api.dto.ReviewDTO;
import com.example.api.dto.UserDTO;
import com.example.api.entity.Product;
import com.example.api.entity.Review;
import com.example.api.entity.User;
import com.example.api.repository.ProductRepository;
import com.example.api.repository.ReviewRepository;
import com.example.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
  private final ReviewRepository reviewRepository;
  private final ProductRepository productRepository;  // 추가
  private final UserRepository userRepository;  // 추가
  @Override
  public List<ReviewDTO> getAllReview() {
    List<Review> review = reviewRepository.findAll(); // Fetch all review
    return review.stream()
        .map(this::entityToDto)
        .collect(Collectors.toList());
  }

  @Override
  public List<ReviewDTO> getAllReviewByProduct(Long pno) {
    log.info("Fetching all review for product pno: {}", pno);
    List<Review> review = reviewRepository.findByProductPno(pno);
    return review.stream().map(this::entityToDto).collect(Collectors.toList());
  }

  @Override
  public List<ReviewDTO> getAllReviewByUser(Long uno) {
    log.info("Fetching all review by consumer uno: {}", uno);
    List<Review> review = reviewRepository.findByConsumerUno(uno);
    return review.stream().map(this::entityToDto).collect(Collectors.toList());
  }

  @Override
  public List<ReviewDTO> getReviewByRating(int rating) {
    log.info("Fetching all review with rating >= {}", rating);
    return reviewRepository.findByRatingGreaterThanEqual(rating).stream()
        .map(this::entityToDto).collect(Collectors.toList());
  }

  @Override
  @Transactional
  public Review reviewregister(ReviewDTO reviewDTO) {
    User consumer = userRepository.findById(reviewDTO.getConsumer_id()) // 수정: getConsumer_id() 사용
        .orElseThrow(() -> new RuntimeException("Consumer not found"));

    Product product = productRepository.findById(reviewDTO.getPno())
        .orElseThrow(() -> new RuntimeException("Product not found"));

    Review review = Review.builder()
        .rating(reviewDTO.getRating())
        .rContent(reviewDTO.getRContent())
        .likes(reviewDTO.getLikes())
        .consumer(consumer) // consumer 설정
        .product(product) // product 설정
        .build();

    return reviewRepository.save(review);
  }

  @Override
  @Transactional
  public void reviewmodify(ReviewDTO reviewDTO) {
    log.info("Updating review RNO: {}", reviewDTO.getRno());
    Review review = reviewRepository.findById(reviewDTO.getRno())
        .orElseThrow(() -> new IllegalArgumentException("Review not found"));
    review.changeRating(reviewDTO.getRating());
    review.changeContent(reviewDTO.getRContent());
    reviewRepository.save(review);
  }

  @Override
  @Transactional
  public void reviewdelete(Long rno) {
    log.info("Deleting review RNO: {}", rno);
    reviewRepository.deleteById(rno);
  }
  // 리뷰 내용과 평점 업데이트 메서드 추가
  @Override
  @Transactional
  public void updateReviewContentAndRating(Long rno, String content, int rating) {
    log.info("Updating review content and rating. RNO: {}", rno);
    Review review = reviewRepository.findById(rno)
        .orElseThrow(() -> new IllegalArgumentException("Review not found"));
    review.changeContent(content);
    review.changeRating(rating);
  }

  // 특정 사용자 기준으로 리뷰 제거
  @Override
  @Transactional
  public void reviewdeleteByUserUno(Long uno) {
    log.info("Removing review by consumer UNO: {}", uno);
    List<Review> reviews = reviewRepository.findByConsumerUno(uno);
    reviewRepository.deleteAll(reviews);
  }
  // 특정 제품 기준으로 리뷰 제거
  @Override
  @Transactional
  public void reviewdeleteByProductPno(Long pno) {
    log.info("Removing review for product PNO: {}", pno);
    reviewRepository.reviewdeleteByProductPno(pno);
  }
  @Override
  public Review dtoToEntity(ReviewDTO reviewDTO) {
    Product product = Product.builder().pno(reviewDTO.getPno()).build();
    User consumer = userRepository.findById(reviewDTO.getConsumer_id()) // 수정: getConsumer_id() 사용
        .orElseThrow(() -> new RuntimeException("Consumer not found"));

    return Review.builder()
        .rno(reviewDTO.getRno())
        .product(product)
        .consumer(consumer)  // 조회된 User 설정
        .rContent(reviewDTO.getRContent())
        .rating(reviewDTO.getRating())
        .likes(reviewDTO.getLikes())
        .build();
  }
}