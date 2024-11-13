package com.example.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(callSuper = true)
@Table(name = "feed")
public class Feed extends BasicEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long fno;

  private String fName;       // 피드 이름 (예: 카테고리 이름 또는 피드 제목)
  private Double fPrice;      // 피드 가격

  // 제품과의 연관 관계
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_id", referencedColumnName = "pno")  // 외래 키 설정
  private Product product;  // 연관된 제품 정보


  @Enumerated(EnumType.STRING)
  private Category category;  // 카테고리 (Taste, Sugar, Protein, Calorie)

  @Enumerated(EnumType.STRING)
  private FeedStatus status;  // 게시물 상태 (등록, 수정, 삭제)

  public void setProduct(Product product) {
    this.product = product;
  }

  public void setCategory(Category category) {
    this.category = category;
  }

  // 필요한 경우 개별적으로 setter 추가
  public void setFName(String fName) {
    this.fName = fName;
  }

  public void setFPrice(Double fPrice) {
    this.fPrice = fPrice;
  }
}
