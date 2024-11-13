package com.example.api.repository;

import com.example.api.entity.Consumer;
import com.example.api.entity.Review;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

  List<Review> findByConsumer(Consumer consumer);

  // 제품에 대한 리뷰를 가져오면서 연관된 사용자 정보를 즉시 로딩
  // 특정 제품에 대한 모든 리뷰 조회
  @EntityGraph(attributePaths = {"consumer"}, type = EntityGraph.EntityGraphType.FETCH)
  List<Review> findByProductPno(@Param("pno") Long pno);

  // 특정 사용자가 작성한 모든 리뷰 조회
//  @Query("select r from Review r where r.consumer.uno = :uno")
//  List<Review> findByUserUno(@Param("uno") Long uno);

  // 특정 평점 이상의 리뷰 조회
  @Query("select r from Review r where r.rating >= :rating")
  List<Review> findByRatingGreaterThanEqual(@Param("rating") int rating);

  // 리뷰 내용과 평점 업데이트
  @Modifying
  @Transactional
  @Query("update Review r set r.rContent = :content, r.rating = :rating where r.rno = :rno")
  void updateReviewContentAndRating(@Param("rno") Long rno, @Param("content") String content, @Param("rating") int rating);

  // 사용자 기준으로 리뷰 삭제
  @Modifying
  @Transactional
  @Query("delete from Review r where r.consumer.uno = :uno")
  void reviewdeleteByUserUno(@Param("uno") Long uno);

  // 제품 ID 기준으로 리뷰 삭제
  @Modifying
  @Transactional
  @Query("delete from Review r where r.product.pno = :pno")
  void reviewdeleteByProductPno(@Param("pno") Long pno);

  @Query("select r from Review r where r.feed.fno = :fno")
  List<Review> findByFeedFno(@Param("fno") Long fno);

  // 특정 사용자가 작성한 모든 리뷰 조회
  @Query("select r from Review r where r.consumer.uno = :uno")
  List<Review> findByConsumerUno(@Param("uno") Long uno);

  @Modifying
  @Transactional
  @Query("delete from Review r where r.feed.fno = :fno")
  void deleteByFeedFno(@Param("fno") Long fno);



}
