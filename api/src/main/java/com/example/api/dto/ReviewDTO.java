package com.example.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReviewDTO {

  @JsonProperty("rno")
  private Long rno;

  @JsonProperty("pno")
  private Long pno;

  @JsonProperty("email")
  private String email;

  @JsonProperty("rating")
  private int rating;

  @JsonProperty("rContent")
  private String rContent;

  @JsonProperty("likes")
  private Long likes;

  @JsonProperty("regDate")
  private LocalDateTime regDate;

  @JsonProperty("modDate")
  private LocalDateTime modDate;

  @JsonProperty("uno")
  private Long uno;

  @JsonProperty("consumer_id")
  private Long consumer_id;

}
