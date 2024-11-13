package com.example.api.repository;

import com.example.api.dto.FeedDTO;
import com.example.api.dto.PageRequestDTO;
import com.example.api.dto.PageResultDTO;
import com.example.api.entity.Category;
import com.example.api.entity.Feed;
import com.example.api.entity.FeedStatus;
import com.example.api.repository.search.SearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FeedRepository extends JpaRepository<Feed, Long>, SearchRepository {
  List<Feed> findByProduct_Pno(Long productId);
  // 기본 피드 목록 조회
  @Query("SELECT f, count(r.likes), count(distinct r) FROM Feed f LEFT JOIN Review r ON r.feed = f GROUP BY f")
  Page<Object[]> getListPage(Pageable pageable);

  // 최신순으로 피드 목록 반환
  @Query("SELECT f, count(r), count(distinct r.likes) FROM Feed f LEFT JOIN Review r ON r.feed = f WHERE f.status = :status GROUP BY f")
  Page<Object[]> getListByNewest(@Param("status") FeedStatus status, Pageable pageable);

  // 카테고리별 피드 목록 반환
  @Query("SELECT f FROM Feed f LEFT JOIN Review r ON r.feed = f WHERE f.category = :category AND f.status = :status GROUP BY f ORDER BY f.fno DESC")
  Page<Feed> getListByCategory(@Param("category") Category category, @Param("status") FeedStatus status, Pageable pageable);

  // 당류 필터링 (정렬은 Pageable의 Sort 옵션을 사용)
  @Query("SELECT f, count(r), count(distinct r.likes) " +
          "FROM Feed f " +
          "LEFT JOIN Review r ON r.feed = f " +
          "JOIN f.product p " +  // Product 엔티티와 JOIN 추가
          "WHERE f.category = :category " +
          "AND p.sugar BETWEEN :minSugar AND :maxSugar " +  // p.sugar로 수정
          "GROUP BY f " +
          "ORDER BY p.sugar DESC")
  // p.sugar로 정렬
  Page<Object[]> filterBySugar(@Param("category") Category category,
                               @Param("minSugar") int minSugar,
                               @Param("maxSugar") int maxSugar,
                               Pageable pageable);
  // 칼로리 필터링
  @Query("SELECT f, count(r), count(distinct r.likes) " +
          "FROM Feed f " +
          "LEFT JOIN Review r ON r.feed = f " +
          "JOIN f.product p " +
          "WHERE f.category = :category " +
          "AND p.calorie BETWEEN :minCalorie AND :maxCalorie " +
          "GROUP BY f " +
          "ORDER BY p.calorie DESC")
  // p.calorie로 정렬
  Page<Object[]> filterByCalorie(@Param("category") Category category,
                                 @Param("minCalorie") int minCalorie,
                                 @Param("maxCalorie") int maxCalorie,
                                 Pageable pageable);

  // 단백질 필터링 (정렬은 Pageable의 Sort 옵션을 사용)
  @Query("SELECT f, count(r), count(distinct r.likes) " +
          "FROM Feed f " +
          "LEFT JOIN Review r ON r.feed = f " +
          "JOIN f.product p " +  // Product 엔티티와 JOIN 추가
          "WHERE f.category = :category " +
          "AND p.protein BETWEEN :minProtein AND :maxProtein " +  // p.protein으로 수정
          "GROUP BY f " +
          "ORDER BY p.protein DESC")
  // p.protein으로 정렬
  Page<Object[]> filterByProtein(@Param("category") Category category,
                                 @Param("minProtein") int minProtein,
                                 @Param("maxProtein") int maxProtein,
                                 Pageable pageable);
  // 맛 필터링
  @Query("SELECT f, count(r), count(distinct r.likes) " +
          "FROM Feed f " +
          "LEFT JOIN Review r ON r.feed = f " +
          "JOIN f.product p " +
          "WHERE f.category = :category " +
          "AND p.taste IN :tasteList " +
          "GROUP BY f")
  Page<Object[]> filterByTaste(@Param("category") Category category,
                               @Param("tasteList") List<String> tasteList,
                               Pageable pageable);


}

