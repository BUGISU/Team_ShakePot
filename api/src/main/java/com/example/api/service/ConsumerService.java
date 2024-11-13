package com.example.api.service;

import com.example.api.dto.ConsumerDTO;
import com.example.api.dto.ReviewDTO;
import com.example.api.entity.Review;

import java.util.List;

public interface ConsumerService {
  ConsumerDTO getLoggedInConsumer();
  Long registerConsumer(ConsumerDTO consumerDTO); // 소비자 등록
  Long updateConsumer(ConsumerDTO consumerDTO);   // 소비자 정보 수정
  void removeConsumer(Long uno);                  // 소비자 삭제
  ConsumerDTO getConsumer(Long uno);              // 소비자 정보 조회
  List<ReviewDTO> getReviewByConsumer(Long uno); // 소비자의 리뷰 조회


  // 리뷰를 추가하는 메서드 정의
  void addReviewToConsumer(Long uno, Review review);

  // 2024-10-31: 사용자 인증 메서드 추가
  boolean isAuthorizedUser(Long uno, String token); // 사용자 권한 확인 메서드 추가
}
