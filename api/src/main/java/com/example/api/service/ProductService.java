package com.example.api.service;

import com.example.api.dto.ProductDTO;
import com.example.api.entity.Category;
import com.example.api.entity.Product;
import com.example.api.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static com.example.api.entity.QCompany.company;

public interface ProductService {

  List<ProductDTO> getAllProducts();

  List<ProductDTO> getProductsByCategoryAndFilter(String category, String filter); // DTO를 반환

  ProductDTO getProductById(Long pno); // ID로 제품 조회 메소드 추가

  // 제품 업데이트 메서드
  ProductDTO updateProduct(Long pno, ProductDTO productDTO, MultipartFile productImage);

  // 제품 삭제 메서드
  void deleteProduct(Long pno);

  // 제품 등록 메소드
  ProductDTO createProduct(ProductDTO productDTO, MultipartFile imageFile);

  ProductDTO entityToDto(Product product);
  // DTO -> Entity 변환
  default Product dtoToEntity(ProductDTO productDTO) {
    return Product.builder()
        .pno(productDTO.getPno())
        .calorie(productDTO.getCalorie())
        .carbohydrate(productDTO.getCarbohydrate())
        .pName(productDTO.getPName())
        .price(productDTO.getPrice())
        .taste(productDTO.getTaste())
        .sugar(productDTO.getSugar())
        .protein(productDTO.getProtein())
        .fat(productDTO.getFat())
        .saturatedFat(productDTO.getSaturatedFat())
        .cholesterol(productDTO.getCholesterol())
        .sodium(productDTO.getSodium())
        .link(productDTO.getLink())
        .build();
  }

  // Entity -> DTO 변환
  default ProductDTO entityToDto(Product product, Long likes, Long reviewCnt) {
    return ProductDTO.builder()
        .pno(product.getPno())
        .pName(product.getPName())
        .price(product.getPrice())
        .taste(product.getTaste())
        .carbohydrate(product.getCarbohydrate())
        .sugar(product.getSugar())
        .protein(product.getProtein())
        .fat(product.getFat())
        .saturatedFat(product.getSaturatedFat())
        .cholesterol(product.getCholesterol())
        .sodium(product.getSodium())
        .calorie(product.getCalorie())
        .link(product.getLink())
        .email(product.getUserEmail())
        .build();
  }


}
