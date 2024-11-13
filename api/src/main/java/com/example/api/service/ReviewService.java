package com.example.api.service;

import com.example.api.dto.ReviewDTO;
import com.example.api.dto.UserDTO;
import com.example.api.entity.Consumer;
import com.example.api.entity.Product;
import com.example.api.entity.Review;
import com.example.api.entity.User;

import java.util.List;

public interface ReviewService {
  List<ReviewDTO> getAllReview();
  List<ReviewDTO> getAllReviewByProduct(Long pno);
  List<ReviewDTO> getAllReviewByUser(Long uno);
  List<ReviewDTO> getReviewByRating(int rating);
  Review reviewregister(ReviewDTO reviewDTO);
  void reviewmodify(ReviewDTO reviewDTO);
  void reviewdelete(Long rno);
  void updateReviewContentAndRating(Long rno, String content, int rating);
  void reviewdeleteByUserUno(Long uno);
  void reviewdeleteByProductPno(Long pno);

  default Review dtoToEntity(ReviewDTO reviewDTO) {
    Product product = Product.builder().pno(reviewDTO.getPno()).build();
    Consumer consumer = Consumer.builder().uno(reviewDTO.getConsumer_id()).email(reviewDTO.getEmail()).build(); // 수정: getConsumer_id() 사용

    return Review.builder()
        .rno(reviewDTO.getRno())
        .product(product)
        .consumer(consumer)
        .rContent(reviewDTO.getRContent())
        .rating(reviewDTO.getRating())
        .likes(reviewDTO.getLikes())
        .build();
  }

  default ReviewDTO entityToDto(Review review) {
    ReviewDTO reviewDTO = ReviewDTO.builder()
        .rno(review.getRno())
        .pno(review.getProduct().getPno())
        .uno(review.getConsumer().getUno())
        .email(review.getUserEmail())
        .rating(review.getRating())
        .likes(review.getLikes())
        .rContent(review.getRContent())
        .regDate(review.getRegDate())
        .modDate(review.getModDate())
        .consumer_id(review.getConsumer().getUno()) // 수정: consumer_id 필드 설정
        .build();

    return reviewDTO;
  }
}