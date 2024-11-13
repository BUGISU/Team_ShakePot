package com.example.api.dto;

import com.example.api.entity.Gender;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@SuperBuilder
@AllArgsConstructor
@EqualsAndHashCode(callSuper=true) // 추가
@NoArgsConstructor
public class CompanyDTO extends UserDTO {

  @JsonProperty("cName")
  private String cName;
  @JsonProperty("cNumber")// 회사 이름

  private String cNumber;  // 회사 전화번호
  private String mainProduct;  // 회사 대표 제품
  private List<String> products;  // 등록된 제품 목록

  public String getCName() {
    return cName;
  }

  public void setCName(String cName) {
    this.cName = cName;
  }

  public String getCNumber() {
    return cNumber;
  }

  public void setCNumber(String cNumber) {
    this.cNumber = cNumber;
  }

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)  // 수정한 부분: Gender 필드에 nullable 속성을 설정해 null 허용하지 않음
  private Gender gender;


}
