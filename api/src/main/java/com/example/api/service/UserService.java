package com.example.api.service;

import com.example.api.dto.CompanyDTO;
import com.example.api.dto.ConsumerDTO;
import com.example.api.dto.UserDTO;
import com.example.api.entity.User;
import com.example.api.entity.UserRole;

import java.util.function.Function;
import java.util.stream.Collectors;

public interface UserService {
  UserDTO entityToDTO(User user);
  User dtoToEntity(UserDTO userDTO);
  Long registerUser(UserDTO userDTO);
  Long joinConsumer(ConsumerDTO consumerDTO);
  Long joinCompany(CompanyDTO companyDTO);
  Long joinAdmin(UserDTO userDTO);
  Long updateUser(UserDTO userDTO);
  UserDTO loginCheck(String email, String rawPassword);
  void removeUser(Long uno);
  UserDTO getUser(Long uno);
  UserDTO getUserByEmail(String email);
}
