package com.example.api.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@MappedSuperclass
@Getter
@Setter
@SuperBuilder // 이 부분을 추가하여 빌더 패턴을 상속 구조에서 사용할 수 있게 합니다.
@AllArgsConstructor
@NoArgsConstructor
public abstract class BasicEntity {

  @Column(updatable = false)
  private LocalDateTime regDate;  // 등록 날짜

  private LocalDateTime modDate;  // 수정 날짜

  @PrePersist
  public void prePersist() {
    this.regDate = LocalDateTime.now();
  }

  @PreUpdate
  public void preUpdate() {
    this.modDate = LocalDateTime.now();
  }
}
