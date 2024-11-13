package com.example.api.dto;

import com.example.api.entity.Gender;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper=true)

public class ConsumerDTO extends UserDTO {

  private String consumerSpecificField;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)  // 수정한 부분: Gender 필드에 nullable 속성을 설정해 null 허용하지 않음
  private Gender gender;
}
