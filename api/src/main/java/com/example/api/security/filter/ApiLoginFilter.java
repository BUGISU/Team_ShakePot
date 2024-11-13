package com.example.api.security.filter;

import com.example.api.security.dto.UserAuthDTO;
import com.example.api.security.service.UserDetailsService;
import com.example.api.security.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;

import java.io.BufferedReader;
import java.io.IOException;

@Log4j2
public class ApiLoginFilter extends AbstractAuthenticationProcessingFilter {
  private JWTUtil jwtUtil;
  private PasswordEncoder passwordEncoder;
  private UserDetailsService userDetailsService;

  public ApiLoginFilter(String defaultFilterProcessUrl, JWTUtil jwtUtil) {
    super(defaultFilterProcessUrl);
    this.jwtUtil = jwtUtil;
    this.passwordEncoder = new BCryptPasswordEncoder(); // PasswordEncoder 설정
  }

  // UserDetailsService를 설정하는 메서드
  public void setUserDetailsService(UserDetailsService userDetailsService) {
    this.userDetailsService = userDetailsService; // 주입
  }

  @Override
  public Authentication attemptAuthentication(
      HttpServletRequest request, HttpServletResponse response)
      throws AuthenticationException, IOException, ServletException {

    String email = null;
    String pw = null;

    // 요청 본문을 JSON으로 파싱하기 위해 BufferedReader를 사용
    StringBuilder sb = new StringBuilder();
    BufferedReader reader = request.getReader();
    String line;

    while ((line = reader.readLine()) != null) {
      sb.append(line);
    }

    // JSON 문자열을 직접 파싱
    String json = sb.toString();

    // JSON 문자열에서 이메일과 비밀번호 추출 (간단한 String 파싱)
    String[] params = json.replaceAll("[{}\"]", "").split(",");
    for (String param : params) {
      String[] keyValue = param.split(":");
      if (keyValue.length == 2) {
        if ("email".equals(keyValue[0].trim())) {
          email = keyValue[1].trim();
        } else if ("pw".equals(keyValue[0].trim())) {
          pw = keyValue[1].trim();
        }
      }
    }

    // 로그 추가
    log.info("Received email: {}", email);
    log.info("Received password: {}", pw);

    if (email == null || pw == null || email.isEmpty() || pw.isEmpty()) {
      log.error("Email or password is null or empty");
      throw new BadCredentialsException("Email or password cannot be null or empty");
    }

    UsernamePasswordAuthenticationToken authToken =
        new UsernamePasswordAuthenticationToken(email, pw);

    // UserDetailsService를 통해 사용자 정보 로드
    UserDetails userDetails = userDetailsService.loadUserByUsername(email);

    if (!(userDetails instanceof UserAuthDTO)) {
      throw new BadCredentialsException("Invalid user details");
    }

    UserAuthDTO userAuthDetails = (UserAuthDTO) userDetails;

    if (!passwordEncoder.matches(pw, userAuthDetails.getPw())) {
      throw new BadCredentialsException("Invalid password");
    }

    return getAuthenticationManager().authenticate(authToken);
  }


  @Override
  protected void successfulAuthentication(
      HttpServletRequest request, HttpServletResponse response,
      FilterChain chain, Authentication authResult)
      throws IOException, ServletException {
    try {
      String email = ((UserAuthDTO) authResult.getPrincipal()).getEmail(); // 이메일 가져오기
      String token = jwtUtil.generateToken(email);
      response.setContentType(MediaType.APPLICATION_JSON_VALUE);

      // 응답 JSON 생성
      String jsonResponse = String.format(
          "{\"token\": \"%s\", \"uno\": \"%s\", \"userType\": \"%s\"}",
          token,
          ((UserAuthDTO) authResult.getPrincipal()).getUno(), // UNO 가져오기
          ((UserAuthDTO) authResult.getPrincipal()).getUserType() // 유저 타입 가져오기
      );

      response.getWriter().write(jsonResponse);
      log.info("generated token :" + token);
    } catch (Exception e) {
      log.error("Error generating token: {}", e.getMessage());
      e.printStackTrace();
      response.setContentType(MediaType.APPLICATION_JSON_VALUE);
      response.getWriter().write("{\"error\": \"Token generation failed\"}");
    }
  }
}
