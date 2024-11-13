package com.example.api.controller;

import com.example.api.dto.CustomerServiceDTO;
import com.example.api.service.CustomerServiceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Log4j2
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequestMapping("/customerservice")
public class CustomerServiceController {
  private final CustomerServiceService customerServiceService;

  // 모든 고객 서비스 요청 조회
  @GetMapping("/all")
  public ResponseEntity<List<CustomerServiceDTO>> getAllRequests() {
    log.info("Fetching all customer service requests");
    List<CustomerServiceDTO> allRequests = customerServiceService.getAllRequests();
    return new ResponseEntity<>(allRequests, HttpStatus.OK);
  }

  // 사용자 ID로 모든 고객 서비스 요청 가져오기
  @GetMapping(value = "/user/{uno}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<List<CustomerServiceDTO>> getAllRequestsByUser(@PathVariable("uno") Long uno) {
    log.info("Fetching customer service requests for user UNO: {}", uno);
    List<CustomerServiceDTO> requests = customerServiceService.getAllRequestsByUser(uno);
    return new ResponseEntity<>(requests, HttpStatus.OK);
  }

  // 제품 ID로 모든 고객 서비스 요청 가져오기
  @GetMapping(value = "/product/{pno}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<List<CustomerServiceDTO>> getAllRequestsByProduct(@PathVariable("pno") Long pno) {
    log.info("Fetching customer service requests for product PNO: {}", pno);
    List<CustomerServiceDTO> requests = customerServiceService.getAllRequestsByProduct(pno);
    return new ResponseEntity<>(requests, HttpStatus.OK);
  }

  // 응답된 모든 고객 서비스 요청 가져오기
  @GetMapping(value = "/responded", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<List<CustomerServiceDTO>> getRespondedRequests() {
    log.info("Fetching all responded customer service requests");
    List<CustomerServiceDTO> respondedRequests = customerServiceService.getRespondedRequests();
    return new ResponseEntity<>(respondedRequests, HttpStatus.OK);
  }

  // 응답되지 않은 모든 고객 서비스 요청 가져오기
  @GetMapping(value = "/unresponded", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<List<CustomerServiceDTO>> getUnrespondedRequests() {
    log.info("Fetching all unresponded customer service requests");
    List<CustomerServiceDTO> unrespondedRequests = customerServiceService.getUnrespondedRequests();
    return new ResponseEntity<>(unrespondedRequests, HttpStatus.OK);
  }

// 고객 서비스 요청 조회 by ID
  @GetMapping({"/inquirydetailconsumer/{csno}", "/inquirydetailadmin/{csno}", "/{csno}"})
  public ResponseEntity<CustomerServiceDTO> getRequestById(@PathVariable("csno") Long csno) {
    log.info("Fetching customer service request with ID: {}", csno);
    CustomerServiceDTO request = customerServiceService.getRequestById(csno);
    return new ResponseEntity<>(request, HttpStatus.OK);
  }
  // 고객 서비스 요청 등록
  @PostMapping("/")
  public ResponseEntity<Long> customerServiceregister(@RequestBody CustomerServiceDTO customerServiceDTO) {
    log.info("Registering customer service request: {}", customerServiceDTO);

    // 제목 또는 내용이 비어 있는지 확인
    if (customerServiceDTO.getCsTitle() == null || customerServiceDTO.getCsContent() == null) {
      log.error("Invalid data received: {}", customerServiceDTO);
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    // 이메일로 사용자 ID 찾기
    Long userUno = customerServiceService.findUserUnoByEmail(customerServiceDTO.getEmail());
    customerServiceDTO.setUno(userUno);

    // 데이터 저장
    CustomerServiceDTO savedRequest = customerServiceService.customerServiceregister(customerServiceDTO);
    return new ResponseEntity<>(savedRequest.getCsno(), HttpStatus.CREATED);
  }
  // 고객 서비스 요청 수정
  @PutMapping("/{csno}")
  public ResponseEntity<Map<String, String>> customerServicemodify(@PathVariable Long csno, @RequestBody CustomerServiceDTO customerServiceDTO) {
    log.info("Modifying customer service request CSNO: {}", csno);
    customerServiceService.customerServicemodify(csno, customerServiceDTO);

    Map<String, String> response = new HashMap<>();
    response.put("status", "success");

    return new ResponseEntity<>(response, HttpStatus.OK); // 성공 메시지 반환
  }


  // 고객 서비스 요청에 대한 응답 업데이트
  @PutMapping("/response/{csno}")
  public ResponseEntity<Void> customerServiceupdate(@PathVariable Long csno, @RequestBody String response) {
    log.info("Updating response for customer service CSNO: {}", csno);
    customerServiceService.customerServiceupdate(csno, response);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  // 사용자 ID로 고객 서비스 요청 삭제
  @DeleteMapping("/user/{uno}")
  public ResponseEntity<Void> customerServicedeleteByUserUno(@PathVariable("uno") Long uno) {
    log.info("Deleting all customer service requests for user ID: {}", uno);
    customerServiceService.customerServicedeleteByUserUno(uno);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  // 사용자 ID와 서비스 요청 번호로 고객 서비스 요청 삭제
  @DeleteMapping("/user/{uno}/request/{csno}")
  public ResponseEntity<Void> customerServicedeleteByUserUnoAndCsno(@PathVariable("uno") Long uno, @PathVariable("csno") Long csno) {
    log.info("Deleting customer service request for user ID: {} and service ID: {}", uno, csno);
    customerServiceService.customerServicedeleteByUserUnoAndCsno(uno, csno);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

}
