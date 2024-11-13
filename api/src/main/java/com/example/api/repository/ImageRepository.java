package com.example.api.repository;

import com.example.api.entity.Image;
import com.example.api.entity.Product;
import com.example.api.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {

  // 특정 제품과 연관된 모든 이미지 조회
  @Query("select i from Image i where i.product = :product")
  List<Image> findByProduct(@Param("product") Product product);

  // 특정 리뷰와 연관된 모든 이미지 조회
  @Query("select i from Image i where i.review = :review")
  List<Image> findByReview(@Param("review") Review review);

  // 이미지 URL로 이미지 조회
  @Query("select i from Image i where i.path = :path")
  Image findByImageUrl(@Param("path") String path);

  // 제품 ID를 기준으로 이미지 삭제
  @Modifying
  @Query("delete from Image i where i.product.pno = :pno")
  void deleteByPno(@Param("pno") Long pno);

  // 리뷰 ID를 기준으로 이미지 삭제
  @Modifying
  @Query("delete from Image i where i.review.rno = :rno")
  void deleteByRno(@Param("rno") Long rno);

  // 특정 피드에 연관된 이미지 삭제
  @Modifying
  @Query("delete from Image i where i.feed.fno = :fno")
  void deleteByFeedFno(@Param("fno") Long fno);

  // 특정 Uuid로 이미지 삭제
  @Modifying
  @Query("delete from Image i where i.uuid = :uuid")
  void deleteByUuid(@Param("uuid") String uuid);

  // 특정 피드 번호로 이미지 목록 가져오기
  @Query("select i from Image i where i.feed.fno = :fno")
  List<Image> findByFeedFno(@Param("fno") Long fno);


}
