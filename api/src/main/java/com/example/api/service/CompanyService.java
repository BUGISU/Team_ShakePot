package com.example.api.service;

import com.example.api.dto.CompanyDTO;
import com.example.api.entity.Product;

public interface CompanyService {

  Long registerCompany(CompanyDTO companyDTO);  // 회사 등록
  Long updateCompany(CompanyDTO companyDTO);    // 회사 정보 수정
  void removeCompany(Long uno);                 // 회사 삭제
  CompanyDTO getCompany(Long uno);              // 회사 정보 조회

  // 새로운 메서드 추가: 회사에 제품을 추가하는 메서드
  void addProductToCompany(Long companyId, Product product);  // 회사에 제품 추가
}
