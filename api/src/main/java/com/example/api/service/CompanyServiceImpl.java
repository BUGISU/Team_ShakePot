package com.example.api.service;

import com.example.api.dto.CompanyDTO;
import com.example.api.entity.Company;
import com.example.api.entity.Product;
import com.example.api.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Collections;

@Service
@Log4j2
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

  private final CompanyRepository companyRepository;

  @Override
  public Long registerCompany(CompanyDTO companyDTO) {
    Company company = dtoToEntity(companyDTO);
    company = companyRepository.save(company);
    return company.getUno();
  }

  @Override
  public Long updateCompany(CompanyDTO companyDTO) {
    Optional<Company> result = companyRepository.findById(companyDTO.getUno());
    if (result.isPresent()) {
      Company company = result.get();
      company.setCName(companyDTO.getCName());
      company.setCNumber(companyDTO.getCNumber());
      company.setMainProduct(companyDTO.getMainProduct());
      companyRepository.save(company);
      return company.getUno();
    }
    return 0L;
  }

  @Override
  @Transactional
  public void removeCompany(Long uno) {
    companyRepository.deleteById(uno);
  }

  @Override
  public CompanyDTO getCompany(Long uno) {
    return companyRepository.findById(uno)
        .map(this::entityToDTO)
        .orElseThrow(() -> new IllegalArgumentException("Company not found with id: " + uno));
  }

  // CompanyServiceImpl에서 제품 추가 로직
  @Override
  @Transactional
  public void addProductToCompany(Long companyId, Product product) {
    Company company = companyRepository.findById(companyId)
        .orElseThrow(() -> new IllegalArgumentException("Company not found"));
    company.addProduct(product);  // Company 내에서 Product 추가
    companyRepository.save(company);  // Company 저장 (cascade로 인해 Product도 저장)
  }

  // DTO -> Entity 변환 메서드 수정
  private Company dtoToEntity(CompanyDTO companyDTO) {
    return Company.builder()
        .cName(companyDTO.getCName())
        .cNumber(companyDTO.getCNumber())
        .mainProduct(companyDTO.getMainProduct())
        .build();
  }

  private CompanyDTO entityToDTO(Company company) {
    return CompanyDTO.builder()
        .uno(company.getUno())
        .cName(company.getCName())
        .cNumber(company.getCNumber())
        .mainProduct(company.getMainProduct())
        .build();
  }
}
