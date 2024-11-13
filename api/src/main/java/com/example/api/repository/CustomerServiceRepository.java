package com.example.api.repository;

import com.example.api.entity.CustomerService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerServiceRepository extends JpaRepository<CustomerService, Long> {


  // 특정 사용자의 모든 고객 서비스 요청 조회
  @Query("select cs from CustomerService cs where cs.user.uno = :uno")
  List<CustomerService> findByUserUno(Long uno);

  // 이메일로 고객 서비스 요청 조회
  @Query("select cs from CustomerService cs where cs.user.email = :email")
  List<CustomerService> findByUserEmail(@Param("email") String email);

  // 제품 ID에 따른 모든 고객 서비스 요청 조회
  @Query("select cs from CustomerService cs where cs.product.pno = :pno")
  List<CustomerService> findByProductPno(Long pno);

  // 관리자 응답이 있는 요청만 조회
  @Query("select cs from CustomerService cs where cs.csResponse is not null")
  List<CustomerService> findByResponseExists();

  // 응답이 없는 요청만 조회
  @Query("select cs from CustomerService cs where cs.csResponse is null")
  List<CustomerService> findWithoutResponse();

  // 고객 서비스 요청에 대한 응답 업데이트
  @Modifying
  @Transactional
  @Query("update CustomerService cs set cs.csResponse = :response where cs.csno = :csno")
  void updateResponse(@Param("csno") Long csno, @Param("response") String response);

  // 사용자 ID에 따라 고객 서비스 요청 삭제
  @Modifying
  @Transactional
  @Query("delete from CustomerService cs where cs.user.uno = :uno")
  void customerServicedeleteByUserUno(@Param("uno") Long uno);

  // 사용자가 자신의 고객 서비스 요청을 삭제
  @Modifying
  @Transactional
  @Query("delete from CustomerService cs where cs.user.uno = :uno and cs.csno = :csno")
  void customerServicedeleteByUserUnoAndCsno(@Param("uno") Long uno, @Param("csno") Long csno);
}
