package com.example.api.dto;

import com.example.api.entity.Gender;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
  private Long uno;
  private String email;
  private String name;
  private String pw;

  @Builder.Default
  private Gender gender = Gender.OTHER; // enum 타입으로 설정
  private boolean fromSocial;
  private Set<String> roleSet = new HashSet<>();
  private String userType;
  private LocalDateTime regDate;
  private LocalDateTime modDate;

  @JsonProperty("cName")
  private String cName; // 회사명 (2024-10-24: 기업회원 가입을 위한 필드 추가)
  @JsonProperty("cNumber")
  private String cNumber; // 사업자 번호 (2024-10-24: 기업회원 가입을 위한 필드 추가)
  private String mainProduct; // 대표 제품 (2024-10-24: 기업회원 가입을 위한 필드 추가)


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

  public void setGender(Gender gender) {
    if (gender == null) {
      throw new IllegalArgumentException("Gender cannot be null");
    }
    this.gender = gender;
  }

}