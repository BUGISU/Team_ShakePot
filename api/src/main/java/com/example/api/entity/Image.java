package com.example.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "feed")
public class Image extends BasicEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long ino;

  private String uuid;
  private String path;  // 이미지 파일의 URL 또는 경로
  private String imageName;  // 실제 파일 이름

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_id")
  private Product product;  // 연관된 제품

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "review_id")
  private Review review;  // 연관된 리뷰

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "feed_id")  // 외래 키 설정
  private Feed feed;  // Feed와 연관된 필드


}
