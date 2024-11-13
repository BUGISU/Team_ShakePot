package com.example.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeedDTO {

  private Long fno;       // 피드 ID
  private String fName;   // 피드 이름
  private double fPrice;  // 피드 가격
  private String category; // 카테고리 (예: Taste, Sugar, Protein, 등)
  private String status;   // 피드 상태 (등록, 수정, 삭제)

  private ProductDTO product; // 연관된 제품 정보 추가

  private List<ImageDTO> imageDTOList;  // 연관된 이미지 목록
  private Long likes;  // 좋아요 수
  private Long reviewCnt;  // 리뷰 수
  private LocalDateTime regDate;
  private LocalDateTime modDate;
}
