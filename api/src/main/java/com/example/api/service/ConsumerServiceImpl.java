package com.example.api.service;

import com.example.api.dto.ConsumerDTO;
import com.example.api.dto.ReviewDTO;
import com.example.api.entity.Consumer;
import com.example.api.entity.Review;
import com.example.api.repository.ConsumerRepository;
import com.example.api.repository.ReviewRepository;
import com.example.api.security.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ConsumerServiceImpl implements ConsumerService {

  private final ConsumerRepository consumerRepository;
  private final ReviewRepository reviewRepository;

  @Autowired
  private JWTUtil jwtUtil;


  @Override
  public Long registerConsumer(ConsumerDTO consumerDTO) {
    Consumer consumer = dtoToEntity(consumerDTO);
    Consumer savedConsumer = consumerRepository.save(consumer);
    return savedConsumer.getUno();
  }

  // 2024-10-31: 사용자 인증 메서드 추가
  @Override
  public boolean isAuthorizedUser(Long uno, String token) {
    try {
      // JWTUtil을 사용하여 이메일 추출
      String email = jwtUtil.validateAndExtract(token.substring(7)); // "Bearer " 부분 제거 후 사용
      ConsumerDTO consumer = getConsumer(uno);

      // consumer 또는 consumer.getEmail()이 null인지 확인한 후 비교 수행
      return consumer != null && consumer.getEmail() != null && consumer.getEmail().equals(email);
    } catch (Exception e) {
      e.printStackTrace();
      return false; // 예외 발생 시 인증 실패로 처리
    }
  }

  @Override
  public ConsumerDTO getConsumer(Long uno) {
    Consumer consumer = consumerRepository.findById(uno)
        .orElseThrow(() -> new IllegalArgumentException("Consumer not found"));
    return entityToDTO(consumer);
  }

  @Override
  public Long updateConsumer(ConsumerDTO consumerDTO) {
    Consumer consumer = consumerRepository.findById(consumerDTO.getUno())
        .orElseThrow(() -> new IllegalArgumentException("Consumer not found"));
    return consumerRepository.save(consumer).getUno();
  }

  @Override
  public void removeConsumer(Long uno) {
    consumerRepository.deleteById(uno);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ReviewDTO> getReviewByConsumer(Long uno) {
    Consumer consumer = consumerRepository.findById(uno)
        .orElseThrow(() -> new IllegalArgumentException("Consumer not found"));
    return reviewRepository.findByConsumer(consumer).stream()
        .map(this::reviewEntityToDTO)
        .collect(Collectors.toList());
  }

  @Override
  public void addReviewToConsumer(Long uno, Review review) {
    Consumer consumer = consumerRepository.findById(uno)
        .orElseThrow(() -> new IllegalArgumentException("Consumer not found"));
    review.setConsumer(consumer); // Review 엔티티에 Consumer 설정
    reviewRepository.save(review); // 리뷰 저장
  }

  private Consumer dtoToEntity(ConsumerDTO consumerDTO) {
    return Consumer.builder()
        .uno(consumerDTO.getUno() != null ? consumerDTO.getUno() : 0L)
        .build();
  }

  private ConsumerDTO entityToDTO(Consumer consumer) {
    return ConsumerDTO.builder()
        .uno(consumer.getUno())
        .build();
  }

  private ReviewDTO reviewEntityToDTO(Review review) {
    return ReviewDTO.builder()
        .rno(review.getRno())
        .pno(review.getProduct().getPno())
        .uno(review.getConsumer() != null ? review.getConsumer().getUno() : null)
        .rating(review.getRating())
        .rContent(review.getRContent())
        .likes(review.getLikes())
        .build();
  }
  @Override
  public ConsumerDTO getLoggedInConsumer() {
    // TODO: 현재 로그인한 사용자의 정보를 반환하는 로직을 작성합니다.
    // 임시로 null을 반환하거나 기본 구조를 작성할 수 있습니다.
    return null;
  }
}
