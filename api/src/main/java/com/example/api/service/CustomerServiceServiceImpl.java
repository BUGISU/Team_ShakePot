package com.example.api.service;

import com.example.api.dto.CustomerServiceDTO;
import com.example.api.entity.CustomerService;
import com.example.api.entity.Product;
import com.example.api.entity.User;
import com.example.api.repository.CustomerServiceRepository;
import com.example.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class CustomerServiceServiceImpl implements CustomerServiceService {

  private final CustomerServiceRepository customerServiceRepository;
  private final UserRepository userRepository; // 사용자 이메일로 user_uno를 찾기 위해 사용

  // 모든 고객 서비스 요청 조회
  @Override
  public List<CustomerServiceDTO> getAllRequests() {
    log.info("모든 고객 서비스 요청을 조회합니다.");
    List<CustomerService> requests = customerServiceRepository.findAll();
    return requests.stream().map(this::entityToDto).collect(Collectors.toList());
  }

  // 특정 사용자의 모든 고객 서비스 요청 조회
  @Override
  public List<CustomerServiceDTO> getAllRequestsByUser(Long uno) {
    log.info("사용자 ID에 따른 모든 고객 서비스 요청을 조회합니다: {}", uno);
    List<CustomerService> requests = customerServiceRepository.findByUserUno(uno);
    return requests.stream().map(this::entityToDto).collect(Collectors.toList());
  }

  // 이메일로 고객 서비스 요청 조회
  @Override
  public List<CustomerServiceDTO> getCustomerServicesByEmail(String email) {
    log.info("이메일에 따른 모든 고객 서비스 요청을 조회합니다: {}", email);
    List<CustomerService> requests = customerServiceRepository.findByUserEmail(email);
    return requests.stream().map(this::entityToDto).collect(Collectors.toList());
  }

  // 특정 제품에 대한 모든 고객 서비스 요청 조회
  @Override
  public List<CustomerServiceDTO> getAllRequestsByProduct(Long pno) {
    log.info("제품 ID에 따른 모든 고객 서비스 요청을 조회합니다: {}", pno);
    List<CustomerService> requests = customerServiceRepository.findByProductPno(pno);
    return requests.stream().map(this::entityToDto).collect(Collectors.toList());
  }

  // 응답이 있는 모든 고객 서비스 요청 조회
  @Override
  public List<CustomerServiceDTO> getRespondedRequests() {
    log.info("응답이 있는 모든 고객 서비스 요청을 조회합니다.");
    return customerServiceRepository.findByResponseExists().stream()
            .map(this::entityToDto).collect(Collectors.toList());
  }

  // 응답이 없는 모든 고객 서비스 요청 조회
  @Override
  public List<CustomerServiceDTO> getUnrespondedRequests() {
    log.info("응답이 없는 모든 고객 서비스 요청을 조회합니다.");
    return customerServiceRepository.findWithoutResponse().stream()
        .map(this::entityToDto).collect(Collectors.toList());
  }

  // 고객 서비스 요청 등록
  @Override
  @Transactional
  public CustomerServiceDTO customerServiceregister(CustomerServiceDTO customerServiceDTO) {
    log.info("새 고객 서비스 요청을 등록합니다: {}", customerServiceDTO);

    // 이메일로 사용자 ID 찾기
    Long userUno = userRepository.findByEmail(customerServiceDTO.getEmail())
        .orElseThrow(() -> new IllegalArgumentException("해당 이메일을 가진 사용자를 찾을 수 없습니다."))
        .getUno();

    customerServiceDTO.setUno(userUno); // 찾은 사용자 ID를 DTO에 설정

    CustomerService customerService = dtoToEntity(customerServiceDTO);
    customerService = customerServiceRepository.save(customerService);
    return entityToDto(customerService); // 저장 후 DTO로 반환
  }

  // 고객 서비스 요청 수정
  @Override
  @Transactional
  public void customerServicemodify(Long csno, CustomerServiceDTO customerServiceDTO) {
    log.info("고객 서비스 요청을 수정합니다. 요청 ID: {}", csno);
    CustomerService customerService = customerServiceRepository.findById(csno)
        .orElseThrow(() -> new IllegalArgumentException("해당 고객 서비스 요청을 찾을 수 없습니다."));
    customerService.updateDetails(customerServiceDTO.getCsTitle(), customerServiceDTO.getCsContent(), customerServiceDTO.getCsResponse());
    customerServiceRepository.save(customerService);
  }

  // 고객 서비스 응답 업데이트
  @Override
  @Transactional
  public void customerServiceupdate(Long csno, String response) {
    log.info("고객 서비스 요청의 응답을 업데이트합니다. 요청 ID: {}", csno);
    customerServiceRepository.updateResponse(csno, response);
  }

  // 고객 서비스 요청 삭제
  @Override
  @Transactional
  public void customerServicedeleteByUserUno(Long uno) {
    log.info("사용자 ID에 따른 모든 고객 서비스 요청을 삭제합니다: {}", uno);
    customerServiceRepository.customerServicedeleteByUserUno(uno);
  }

  @Override
  @Transactional
  public void customerServicedeleteByUserUnoAndCsno(Long uno, Long csno) {
    log.info("사용자 ID 및 요청 ID에 따른 고객 서비스 요청을 삭제합니다. 사용자 ID: {}, 요청 ID: {}", uno, csno);
    customerServiceRepository.customerServicedeleteByUserUnoAndCsno(uno, csno);
  }

  @Override
  public Long findUserUnoByEmail(String email) {
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new IllegalArgumentException("해당 이메일을 가진 사용자를 찾을 수 없습니다."))
        .getUno();
  }

  @Override
  public CustomerServiceDTO getRequestById(Long csno) {
    CustomerService request = customerServiceRepository.findById(csno)
        .orElseThrow(() -> new RuntimeException("해당 요청을 찾을 수 없습니다."));
    return entityToDto(request);
  }
  @Override
  // 엔티티를 DTO로 변환하는 메서드
  public CustomerServiceDTO entityToDto(CustomerService customerService) {
    return CustomerServiceDTO.builder()
            .csno(customerService.getCsno())
            .csTitle(customerService.getCsTitle())
            .csContent(customerService.getCsContent())
            .csResponse(customerService.getCsResponse()) // 응답 필드 누락 방지
            .uno(customerService.getUser().getUno())
            .email(customerService.getUser().getEmail())
            .pno(customerService.getProduct() != null ? customerService.getProduct().getPno() : null)
            .regDate(customerService.getRegDate())
            .modDate(customerService.getModDate())
            .build();
  }

  // DTO를 엔티티로 변환하는 메서드
  public CustomerService dtoToEntity(CustomerServiceDTO customerServiceDTO) {
    User user = User.builder().uno(customerServiceDTO.getUno()).build();
    Product product = customerServiceDTO.getPno() != null ? Product.builder().pno(customerServiceDTO.getPno()).build() : null;
    return CustomerService.builder()
        .csno(customerServiceDTO.getCsno())
        .csTitle(customerServiceDTO.getCsTitle())
        .csContent(customerServiceDTO.getCsContent())
        .csResponse(customerServiceDTO.getCsResponse())
        .user(user)
        .product(product)

        .build();
  }
}
