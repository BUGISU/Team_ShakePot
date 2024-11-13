package com.example.api.controller;

import com.example.api.dto.CompanyDTO;
import com.example.api.dto.ProductDTO;
import com.example.api.entity.Product;
import com.example.api.service.CompanyService;
import com.example.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Log4j2
@RequestMapping("/company")
@RequiredArgsConstructor
public class CompanyController {

  private final CompanyService companyService;

//  @PostMapping("/join")
//  public ResponseEntity<Long> joinCompany(@RequestBody CompanyDTO companyDTO) {
//    log.info("Registering company: {}", companyDTO);
//    Long uno = companyService.registerCompany(companyDTO);
//    return new ResponseEntity<>(uno, HttpStatus.OK);
//  }

  @PutMapping("/update/{uno}")
  public ResponseEntity<Long> updateCompany(@PathVariable Long uno, @RequestBody CompanyDTO companyDTO) {
    companyDTO.setUno(uno);
    log.info("Updating company with ID: {}", uno);
    Long updatedUno = companyService.updateCompany(companyDTO);
    return new ResponseEntity<>(updatedUno, HttpStatus.OK);
  }

  @DeleteMapping("/delete/{uno}")
  public ResponseEntity<Void> deleteCompany(@PathVariable Long uno) {
    log.info("Deleting company with ID: {}", uno);
    companyService.removeCompany(uno);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  @GetMapping("/{uno}")
  public ResponseEntity<CompanyDTO> getCompany(@PathVariable Long uno) {
    log.info("Fetching company with ID: {}", uno);
    CompanyDTO companyDTO = companyService.getCompany(uno);
    return new ResponseEntity<>(companyDTO, HttpStatus.OK);
  }

  private final ProductService productService;

  @PostMapping("/{companyId}/product")
  public ResponseEntity<Void> addProductToCompany(
      @PathVariable Long companyId,
      @RequestBody ProductDTO productDTO) {

    // ProductDTO를 Product로 변환하여 ProductService로 처리
    Product product = productService.dtoToEntity(productDTO);

    // Company에 Product 추가
    companyService.addProductToCompany(companyId, product);

    return new ResponseEntity<>(HttpStatus.OK);
  }
}
