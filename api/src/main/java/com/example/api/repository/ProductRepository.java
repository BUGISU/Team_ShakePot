package com.example.api.repository;

import com.example.api.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

  // 판매량 관련 메서드 (SQL)
  @EntityGraph(attributePaths = {"company"}, type = EntityGraph.EntityGraphType.LOAD)
  @Query("select p from Product p where p.salesVolume > 0 order by p.salesVolume desc")
  List<Product> findBySalesVolume();

  // 추천 제품 필터링 메서드 (SQL)
  @EntityGraph(attributePaths = {"company"}, type = EntityGraph.EntityGraphType.LOAD)
  @Query("select p from Product p where p.isRecommended = true")
  List<Product> findByIsRecommendedTrue();

  @EntityGraph(attributePaths = {"company"}, type = EntityGraph.EntityGraphType.LOAD)
  @Query("select p from Product p where p.taste = :taste")
  List<Product> findByTaste(String taste);

  @EntityGraph(attributePaths = {"company"}, type = EntityGraph.EntityGraphType.LOAD)
  @Query("select p from Product p where p.sugar <= :sugar")
  List<Product> findBySugarLessThanEqual(int sugar);

  @EntityGraph(attributePaths = {"company"}, type = EntityGraph.EntityGraphType.LOAD)
  @Query("select p from Product p where p.sugar between :min and :max")
  List<Product> findBySugarBetween(int min, int max);

  @EntityGraph(attributePaths = {"company"}, type = EntityGraph.EntityGraphType.LOAD)
  @Query("select p from Product p where p.sugar >= :sugar")
  List<Product> findBySugarGreaterThanEqual(int sugar);

  @EntityGraph(attributePaths = {"company"}, type = EntityGraph.EntityGraphType.LOAD)
  @Query("select p from Product p where p.protein >= :protein")
  List<Product> findByProteinGreaterThanEqual(int protein);

  @EntityGraph(attributePaths = {"company"}, type = EntityGraph.EntityGraphType.LOAD)
  @Query("select p from Product p where p.protein between :min and :max")
  List<Product> findByProteinBetween(int min, int max);

  @EntityGraph(attributePaths = {"company"}, type = EntityGraph.EntityGraphType.LOAD)
  @Query("select p from Product p where p.protein <= :protein")
  List<Product> findByProteinLessThanEqual(int protein);

  @EntityGraph(attributePaths = {"company"}, type = EntityGraph.EntityGraphType.LOAD)
  @Query("select p from Product p where p.calorie <= :calorie")
  List<Product> findByCalorieLessThanEqual(int calorie);

  @EntityGraph(attributePaths = {"company"}, type = EntityGraph.EntityGraphType.LOAD)
  @Query("select p from Product p where p.calorie between :min and :max ")
  List<Product> findByCalorieBetween(int min, int max);

  @EntityGraph(attributePaths = {"company"}, type = EntityGraph.EntityGraphType.LOAD)
  @Query("select p from Product p where p.calorie >= :calorie")
  List<Product> findByCalorieGreaterThanEqual(int calorie);


}
