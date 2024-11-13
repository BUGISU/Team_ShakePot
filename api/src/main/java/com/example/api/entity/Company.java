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
@DiscriminatorValue("COMPANY")
public class Company extends User {

  @Column(name ="cName")
  private String cName;

  @Column(name = "cNumber")
  private String cNumber;  // 사업자번호
  private String mainProduct;  // 대표 제품

  @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<Product> products = new ArrayList<>();

  public void addProduct(Product product) {
    products.add(product);
  }

  public void setProducts(List<Product> products) {
    this.products = products != null ? new ArrayList<>(products) : new ArrayList<>();
  }
}
