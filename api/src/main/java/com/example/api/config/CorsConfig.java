package com.example.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

//  @Bean
//  public CorsFilter corsFilter() {
//    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//    CorsConfiguration config = new CorsConfiguration();
//    config.setAllowCredentials(true);
//    config.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174", "http://localhost:8080")); // 정확한 도메인 추가
//    config.addAllowedHeader("*");
//    config.addAllowedMethod("*");
//    config.addAllowedOriginPattern("*"); // 모든 출처 허용
//
//    source.registerCorsConfiguration("/**", config);
//    return new CorsFilter(source);
//  }
}
