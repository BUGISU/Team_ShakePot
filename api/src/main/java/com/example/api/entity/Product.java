package com.example.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter  // 만약 setter를 사용하고 싶다면 추가
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"feed", "user","company"})
@Table(name = "product")
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long pno;  // 제품 ID (Primary Key)

  private String pName;      // 제품 이름
  private String taste;      // 제품 맛
  private String link;

  // 영양 성분 정보
  private int carbohydrate;  // 탄수화물(g)
  private int sugar;         // 당류(g)
  private int protein;       // 단백질(g)
  private int fat;           // 지방(g)
  private int transFat;      // 트랜스지방(g)
  private int saturatedFat;  // 포화지방(g)
  private int cholesterol;   // 콜레스테롤(mg)
  private int sodium;        // 나트륨(mg)
  private int calorie;       // 칼로리(kcal)

  private double price;      // 가격

  // 추가적인 필터를 위한 필드들
  private boolean isRecommended;  // 추천 여부
  private int salesVolume;        // 판매량

  // 관계 설정 (회사 정보와 연관)
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "company_id")
  private User company;  // 제품을 등록한 기업 (Many-to-One 관계)

  @Enumerated(EnumType.STRING)
  private Category category; // 제품 카테고리 (Taste, Sugar, Protein 등)

  // 회사 정보 설정 메소드 (비즈니스 로직에서 사용 가능)
  public void setCompany(User company) {
    this.company = company;
  }

  public void setImagePath(String imagePath) {
  }

  // 요청한 사용자의 이메일을 가져오는 메서드
  public String getUserEmail() {
    return this.company != null ? this.company.getEmail() : null;
  }
}
