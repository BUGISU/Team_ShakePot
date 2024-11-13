package com.example.api.security.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

@Log4j2
@Getter
@Setter
@ToString
public class UserAuthDTO extends User implements OAuth2User {
  private String userType;
  private Long uno;
  private String email;
  private String pw; // 비밀번호 저장
  private String name;
  private boolean fromSocial;
  private Map<String, Object> attr; // 소셜로부터 받은 정보를 저장하는 속성

  public UserAuthDTO(String name, String pw,
                     Long uno, boolean fromSocial,
                     Collection<? extends GrantedAuthority> authorities) {
    super(name, pw, authorities); // User 클래스 생성자 호출
    this.uno = uno;
    this.email = name;  // UserDetails에서 username은 email로 기준하기 때문.
    this.fromSocial = fromSocial;
    this.pw = pw; // 비밀번호 설정
    this.userType = getUserType();
  }

  // 소셜로부터 받을 때 별도의 생성자
  public UserAuthDTO(String name, String pw,
                     Long uno, boolean fromSocial,
                     Collection<? extends GrantedAuthority> authorities,
                     Map<String, Object> attr) {
    this(name, pw, uno, fromSocial, authorities);
    this.attr = attr;
  }

  @Override
  public Map<String, Object> getAttributes() {
    return this.attr;
  }

  public String getPass() {
    return this.pw; // 비밀번호 반환
  }

  public void setUserType(String userType) {
    this.userType = userType;
  }
}
