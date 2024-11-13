package com.example.api.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@ToString(callSuper = true)
@DiscriminatorValue("CONSUMER") // Consumer 구분자 추가
public class Consumer extends User {

  @OneToMany(mappedBy = "consumer", cascade = CascadeType.ALL)
  @Builder.Default
  private List<Review> review = new ArrayList<>();

  public void addReview(Review review) {
    this.review.add(review);
  }

  public void setReview(List<Review> review) {
    this.review = review != null ? new ArrayList<>(review) : new ArrayList<>();
  }
}
