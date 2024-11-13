package com.example.api.security.service;

import com.example.api.entity.User;
import com.example.api.repository.UserRepository;
import com.example.api.security.dto.UserAuthDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {
  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    log.info("loadUserByUsername called with username: {}", username);
    Optional<User> result = userRepository.findByEmail(username);
    if (!result.isPresent()) throw new UsernameNotFoundException("Check Email or Social");
    User user = result.get();

    UserAuthDTO userAuthDTO = new UserAuthDTO(
        user.getEmail(), user.getPw(), user.getUno(),
        user.isFromSocial(),
        user.getRoleSet().stream().map(
            UserRole -> new SimpleGrantedAuthority(
                "ROLE_" + UserRole.name())).collect(Collectors.toList())
    );
    userAuthDTO.setUserType(user.getUserType()); // 여기서 유저 타입을 설정해야 합니다.
    userAuthDTO.setName(user.getName());
    userAuthDTO.setFromSocial(user.isFromSocial());

    log.info("User found: {}, pw: {}", username, user.getPw());

    return userAuthDTO;
  }
}
