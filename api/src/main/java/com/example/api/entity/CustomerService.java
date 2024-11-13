package com.example.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "user")  // user 필드에서 순환 참조 방지
@Table(name = "customerservice")
public class CustomerService extends BasicEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long csno;

  private String csTitle;  // 고객 요청 제목

  private String csContent;  // 요청 내용

  private String csResponse;  // 관리자 답변

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_uno")  // user 테이블의 외래 키와 연결
  private User user;  // 요청한 사용자

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_pno")
  private Product product;  // 제품과 연관된 요청

  // 고객 서비스 세부사항 업데이트
  public void updateDetails(String title, String content, String response) {
    this.csTitle = title;
    this.csContent = content;
    this.csResponse = response;
  }

  // 요청한 사용자의 이메일을 가져오는 메서드
  public String getUserEmail() {
    return this.user != null ? this.user.getEmail() : null;
  }
}
