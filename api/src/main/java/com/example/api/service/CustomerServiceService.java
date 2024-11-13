package com.example.api.service;

import com.example.api.dto.CustomerServiceDTO;
import com.example.api.entity.CustomerService;
import com.example.api.entity.Product;
import com.example.api.entity.User;
import com.example.api.repository.UserRepository;

import java.util.List;

public interface CustomerServiceService {

  // 특정 사용자의 모든 고객 서비스 요청 조회
  List<CustomerServiceDTO> getAllRequestsByUser(Long uno);

  // 이메일로 고객 서비스 요청 조회
  List<CustomerServiceDTO> getCustomerServicesByEmail(String email);

  // 특정 제품에 대한 모든 고객 서비스 요청 조회
  List<CustomerServiceDTO> getAllRequestsByProduct(Long pno);

  // 관리자 응답이 있는 모든 요청 조회
  List<CustomerServiceDTO> getRespondedRequests();

  // 응답이 없는 모든 요청 조회
  List<CustomerServiceDTO> getUnrespondedRequests();

  // 모든 고객 서비스 요청 조회
  List<CustomerServiceDTO> getAllRequests();

  // 고객 서비스 요청 등록
  CustomerServiceDTO customerServiceregister(CustomerServiceDTO customerServiceDTO);

  // 고객 서비스 요청 수정
  void customerServicemodify(Long csno, CustomerServiceDTO customerServiceDTO);

  // 고객 서비스 요청에 대한 응답 업데이트
  void customerServiceupdate(Long csno, String response);

  // 사용자 ID와 고객 서비스 요청 ID를 사용하여 요청 삭제
  void customerServicedeleteByUserUno(Long uno);
  void customerServicedeleteByUserUnoAndCsno(Long uno, Long csno);
  // 사용자 이메일로 uno를 찾는 메서드 정의
  Long findUserUnoByEmail(String email);
  // 엔티티를 DTO로 변환하는 메서드
  CustomerServiceDTO entityToDto(CustomerService customerService);
  CustomerService dtoToEntity(CustomerServiceDTO customerServiceDTO);


  CustomerServiceDTO getRequestById(Long csno);


}
