// SecurityConfig.java

package com.example.api.config;

import com.example.api.security.filter.ApiCheckFilter;
import com.example.api.security.filter.ApiLoginFilter;
import com.example.api.security.handler.ApiLoginFailHandler;
import com.example.api.security.service.UserDetailsService;
import com.example.api.security.util.JWTUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final AuthenticationConfiguration authenticationConfiguration;

    public SecurityConfig(UserDetailsService userDetailsService, AuthenticationConfiguration authenticationConfiguration) {
        this.userDetailsService = userDetailsService;
        this.authenticationConfiguration = authenticationConfiguration;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ApiCheckFilter apiCheckFilter() {
        return new ApiCheckFilter(new String[]{"/consumer/**"}, jwtUtil());
    }

    @Bean
    public JWTUtil jwtUtil() {
        return new JWTUtil(); // JWTUtil 빈 설정
    }

    @Bean
    public ApiLoginFilter apiLoginFilter() throws Exception {
        ApiLoginFilter apiLoginFilter = new ApiLoginFilter("/auth/login", jwtUtil());
        apiLoginFilter.setAuthenticationManager(authenticationConfiguration.getAuthenticationManager());
        apiLoginFilter.setAuthenticationFailureHandler(new ApiLoginFailHandler());
        apiLoginFilter.setUserDetailsService(userDetailsService);
        return apiLoginFilter;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(new BCryptPasswordEncoder() {
            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                if (encodedPassword.startsWith("$2a$")) {
                    return super.matches(rawPassword, encodedPassword);
                } else {
                    return rawPassword.equals(encodedPassword);
                }
            }
        });
        return authProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.cors(httpSecurityCorsConfigurer -> httpSecurityCorsConfigurer.configurationSource(request -> {
            var cors = new org.springframework.web.cors.CorsConfiguration();
            cors.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174", "http://localhost:8080", "http://localhost:3000"));
            cors.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            cors.setAllowedHeaders(Arrays.asList("*", "Authorization", "Content-Type"));
            cors.setAllowCredentials(true);
            return cors;
        }));

        httpSecurity.csrf(csrf -> csrf.disable());

        httpSecurity.authorizeHttpRequests(
            auth -> auth
                .requestMatchers(new AntPathRequestMatcher("/auth/join")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/auth/login")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/customerservice/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/product/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/feed/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/user/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/review/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/review/all")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/display/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/product/register")).hasRole("ADMIN")
                .requestMatchers(new AntPathRequestMatcher("/review/register")).permitAll()
                .requestMatchers("/review/register").permitAll()
                .requestMatchers("/review/product/**").permitAll()
                .requestMatchers("/feed/read/**").permitAll()
                // 여기에서 consumer 역할을 가진 사용자만 PUT 요청을 허용합니다.
                .requestMatchers(new AntPathRequestMatcher("/consumer/**")).authenticated()
                .requestMatchers("/api/user/**").authenticated()
                .anyRequest().authenticated()
        );

        httpSecurity.addFilterBefore(apiLoginFilter(), UsernamePasswordAuthenticationFilter.class);
        httpSecurity.addFilterAfter(apiCheckFilter(), UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }
}
