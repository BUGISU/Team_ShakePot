package com.example.api.dto;

import com.example.api.entity.Product;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductDTO {

  //@JsonProperty("uno")
  private Long uno; // user, consumer
  //@JsonProperty("email")
  private String email;      // 요청한 사용자의 이메일

  @JsonProperty("pno")
  private Long pno; // 제품 ID (엔티티에서 가져옴)

  @JsonProperty("pName")
  private String pName;  // 제품 이름

  @JsonProperty("company_id")
  private Long company_id;  // 추가된 필드

  @JsonProperty("taste")
  private String taste;  // 맛

  @JsonProperty("calorie")
  private int calorie;  // 칼로리(kcal)

  @JsonProperty("carbohydrate")
  private int carbohydrate;  // 탄수화물(g)

  @JsonProperty("sugar")
  private int sugar;  // 당류(g)

  @JsonProperty("protein")
  private int protein;  // 단백질(g)

  @JsonProperty("fat")
  private int fat;  // 지방(g)

  @JsonProperty("transFat")
  private int transFat;  // 트랜스지방(g)

  @JsonProperty("saturatedFat")
  private int saturatedFat;  // 포화지방(g)

  @JsonProperty("cholesterol")
  private int cholesterol;  // 콜레스테롤(mg)

  @JsonProperty("sodium")
  private int sodium;  // 나트륨(mg)

  @JsonProperty("price")
  private double price;  // 가격

  // `link` 필드 추가
  @JsonProperty("link")
  private String link;

  @JsonProperty("category")
  private String category; // 카테고리 (예: Taste, Sugar, Protein, 등)

  @JsonProperty("is_Recommended")
  private boolean isRecommended;  // 추천 여부

  @JsonProperty("sales_Volume")
  private int salesVolume;        // 판매량

  // 엔티티를 받아서 DTO로 변환하는 생성자 추가
  public ProductDTO(Product product) {
    this.pno = product.getPno();
    this.pName = product.getPName();
    this.taste = product.getTaste();
    this.carbohydrate = product.getCarbohydrate();
    this.sugar = product.getSugar();
    this.protein = product.getProtein();
    this.fat = product.getFat();
    this.transFat = product.getTransFat();
    this.saturatedFat = product.getSaturatedFat();
    this.cholesterol = product.getCholesterol();
    this.sodium = product.getSodium();
    this.calorie = product.getCalorie();
    this.price = product.getPrice();
    this.link = product.getLink();
    this.category = product.getCategory().name();
    this.company_id = product.getCompany() != null ? product.getCompany().getUno() : null;  // 수정된 부분
  }

}
