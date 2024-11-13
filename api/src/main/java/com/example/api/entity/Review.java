package com.example.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"product", "user","consumer"})
@Table(name = "review")
public class Review extends BasicEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long rno;

  private String rContent;  // 리뷰 내용

  private int rating;  // 평점

private Long likes = 0L;  // 좋아요 수 추가

  // 리뷰를 남긴 사용자와 연관
//  @ManyToOne(fetch = FetchType.LAZY)
//  @JoinColumn(name = "user_uno", referencedColumnName = "uno", insertable = false, updatable = false)
//  private User user;

  // 제품과 연관
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "pno")
  private Product product;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fno")  // 외래 키 설정
  private Feed feed;  // Feed와 연관된 필드

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "consumer_id")
  private User consumer; // 소비자 (Many-to-One 관계)

  public void changeRating(int rating) {this.rating = rating;}
  public void changeContent(String rContent) {this.rContent = rContent;}

  public void setConsumer(User consumer) { this.consumer = consumer; } // Consumer 설정 메서드 추가

  // 요청한 사용자의 이메일을 가져오는 메서드
  public String getUserEmail() {
    return this.consumer != null ? this.consumer.getEmail() : null;
  }
}
