package com.example.api.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "user")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "userType")
@DiscriminatorValue("ADMIN")
public class User extends BasicEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long uno;

  @Column(unique = true)
  private String email;

  private String name;
  @Column(nullable = false)
  private String pw;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Gender gender;

  private boolean fromSocial;

  @ElementCollection(fetch = FetchType.LAZY)
  @Builder.Default
  private Set<UserRole> roleSet = new HashSet<>();

  @Column(name = "userType", insertable = false, updatable = false)
  private String userType;

    public void addUserRole(UserRole userRole) {
    roleSet.add(userRole);
  }

  public boolean isAdmin() {
    return roleSet.contains(UserRole.ADMIN);
  }

  public void setUserType(String userType) {
    this.userType = userType;
  }


}
