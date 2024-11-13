package com.example.api.controller;

import com.example.api.dto.ProductDTO;
import com.example.api.entity.Product;
import com.example.api.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/product")
@CrossOrigin
public class ProductController {

  private final ProductService productService;

  @Autowired
  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  @PostMapping("/register")
  public ResponseEntity<?> registerProduct(
      @RequestPart("product") String product,
      @RequestPart(value = "productImage", required = false) MultipartFile productImage) {

    try {
      ProductDTO productDTO = new ObjectMapper().readValue(product, ProductDTO.class);

      ProductDTO savedProductDTO = productService.createProduct(productDTO, productImage);

      log.info("Product registered successfully: " + savedProductDTO);

      return new ResponseEntity<>(savedProductDTO, HttpStatus.CREATED);
    } catch (Exception e) {
      log.error("Error during product registration", e);
      return new ResponseEntity<>("Product registration failed", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/filter")
  public ResponseEntity<List<ProductDTO>> getFilteredProducts(
      @RequestParam String category,
      @RequestParam String filter) {
    List<ProductDTO> filteredProducts = productService.getProductsByCategoryAndFilter(category, filter);
    return ResponseEntity.ok(filteredProducts);
  }

  // 모든 제품을 반환하는 새로운 API 엔드포인트
  @GetMapping("/all")
  public ResponseEntity<List<ProductDTO>> getAllProducts() {
    List<ProductDTO> allProducts = productService.getAllProducts(); // 서비스 계층에서 모든 제품 정보를 가져오는 메소드
    return ResponseEntity.ok(allProducts);
  }

  // 제품 ID로 단일 제품을 반환하는 API 엔드포인트
  @GetMapping("/{pno}")
  public ResponseEntity<ProductDTO> getProductById(@PathVariable Long pno) {
    ProductDTO product = productService.getProductById(pno);
    if (product != null) {
      return ResponseEntity.ok(product);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @PutMapping("/{pno}")
//  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> updateProduct(
      @PathVariable Long pno,
      @RequestPart("product") String product, // JSON 데이터
      @RequestPart(value = "productImage", required = false) MultipartFile productImage) { // 이미지 파일

    try {
      // JSON 문자열을 ProductDTO로 변환
      ProductDTO productDTO = new ObjectMapper().readValue(product, ProductDTO.class);

      // 서비스에서 업데이트 로직 수행
      ProductDTO updatedProduct = productService.updateProduct(pno, productDTO, productImage);
      return ResponseEntity.ok(updatedProduct);
    } catch (Exception e) {
      log.error("Error updating product", e);
      return new ResponseEntity<>("Product update failed", HttpStatus.BAD_REQUEST);
    }
  }

  @DeleteMapping("/{pno}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> deleteProduct(@PathVariable Long pno) {
    try {
      productService.deleteProduct(pno);
      return ResponseEntity.ok("Product deleted successfully");
    } catch (Exception e) {
      log.error("Error deleting product", e);
      return new ResponseEntity<>("Product deletion failed", HttpStatus.BAD_REQUEST);
    }
  }
}
