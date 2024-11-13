package com.example.api.service;

import com.example.api.dto.ProductDTO;
import com.example.api.entity.*;
import com.example.api.repository.FeedRepository;
import com.example.api.repository.ProductRepository;
import com.example.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.example.api.entity.QProduct.product;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional  // 클래스 전체에 트랜잭션 적용
public class ProductServiceImpl implements ProductService {

  @Autowired
  private final ProductRepository productRepository;
  @Autowired
  private final UserRepository userRepository; // 사용자 ID로 회사 정보를 찾기 위해 사용
  @Autowired
  private final FeedRepository feedRepository; // Feed repository 추가

  @Override
  @Transactional
  public ProductDTO createProduct(ProductDTO productDTO, MultipartFile imageFile) {
    log.info("Creating product: " + productDTO);

    // ProductDTO를 Product 엔티티로 변환
    Product product = dtoToEntity(productDTO);

    // Product 저장
    Product savedProduct = productRepository.save(product);

    // Feed 엔티티 생성 및 저장
    Feed feed = Feed.builder()
        .product(savedProduct)
        .fName(savedProduct.getPName())
        .fPrice(savedProduct.getPrice())
        .category(savedProduct.getCategory())  // Enum으로 전달
        .status(FeedStatus.REGISTERED)
        //.regDate(LocalDateTime.now())
        .build();

    feedRepository.save(feed); // Feed 저장

    log.info("Product and Feed saved successfully");

    // 저장된 엔티티를 DTO로 변환하여 반환
    return new ProductDTO(savedProduct);
  }

  @Override
  public ProductDTO getProductById(Long pno) {
    // repository에서 제품 ID로 조회 로직
    return productRepository.findById(pno)
        .map(this::entityToDto)
        .orElseThrow(() -> new IllegalArgumentException("해당 ID를 가진 제품이 없습니다: " + pno));
  }

  @Override
  public List<ProductDTO> getAllProducts() {
    return productRepository.findAll()
        .stream()
        .map(this::entityToDto)
        .collect(Collectors.toList());
  }
  private String saveProductImage(MultipartFile productImage) throws IOException {
    String fileName = UUID.randomUUID() + "_" + productImage.getOriginalFilename();
    String uploadDir = "uploads/"; // 이미지 저장 경로 설정
    File uploadPath = new File(uploadDir);

    if (!uploadPath.exists()) {
      uploadPath.mkdirs();
    }

    File imageFile = new File(uploadPath, fileName);
    productImage.transferTo(imageFile);

    return uploadDir + fileName; // 이미지 경로 반환
  }
  @Override
  public ProductDTO updateProduct(Long pno, ProductDTO productDTO, MultipartFile productImage) {
    // 제품 엔티티 조회
    Product product = productRepository.findById(pno)
        .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + pno));

    // 제품 정보 업데이트
    product.setPName(productDTO.getPName());
    product.setPrice(productDTO.getPrice());
    product.setTaste(productDTO.getTaste());
    product.setCarbohydrate(productDTO.getCarbohydrate());
    product.setSugar(productDTO.getSugar());
    product.setProtein(productDTO.getProtein());
    product.setFat(productDTO.getFat());
    product.setTransFat(productDTO.getTransFat());
    product.setSaturatedFat(productDTO.getSaturatedFat());
    product.setCholesterol(productDTO.getCholesterol());
    product.setSodium(productDTO.getSodium());
    product.setCalorie(productDTO.getCalorie());
    product.setLink(productDTO.getLink());

    // 이미지 파일이 있을 경우 이미지 업데이트
    if (productImage != null && !productImage.isEmpty()) {
      try {
        String imagePath = saveProductImage(productImage);
        product.setImagePath(imagePath); // 이미지 경로 필드가 있다고 가정
      } catch (IOException e) {
        throw new RuntimeException(e);
      }
    }

    // product 업데이트 후 연관된 feed 엔티티들도 업데이트
    updateFeedsWithProduct(product);

    productRepository.save(product); // 변경된 정보 저장

    return entityToDto(product); // DTO 변환 및 반환
  }

  // feed 업데이트 로직 추가
  private void updateFeedsWithProduct(Product product) {
    List<Feed> relatedFeeds = feedRepository.findByProduct_Pno(product.getPno());

    for (Feed feed : relatedFeeds) {
      feed.setFName(product.getPName());
      feed.setFPrice(product.getPrice());
      feed.setCategory(product.getCategory());
      // 필요한 다른 필드도 업데이트
      feedRepository.save(feed);
    }
  }


  @Override
  public void deleteProduct(Long pno) {
    // 제품 엔티티 조회
    Product product = productRepository.findById(pno)
        .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + pno));

    productRepository.delete(product); // 제품 삭제
  }

  // 엔티티 -> DTO 변환 메서드
  @Override
  public ProductDTO entityToDto(Product product) {
    return ProductDTO.builder()
        .pno(product.getPno())  // 제품 ID 포함
        .pName(product.getPName())
        .taste(product.getTaste())
        .carbohydrate(product.getCarbohydrate())
        .sugar(product.getSugar())
        .protein(product.getProtein())
        .fat(product.getFat())
        .transFat(product.getTransFat())
        .saturatedFat(product.getSaturatedFat())
        .cholesterol(product.getCholesterol())
        .sodium(product.getSodium())
        .calorie(product.getCalorie())
        .price(product.getPrice())
        .link(product.getLink())
        .build();
  }

  // DTO -> 엔티티 변환 메서드
  @Override
  public Product dtoToEntity(ProductDTO productDTO) {
    Product.ProductBuilder builder = Product.builder()
        .pno(productDTO.getPno())
        .pName(productDTO.getPName())
        .price(productDTO.getPrice())
        .taste(productDTO.getTaste())
        .carbohydrate(productDTO.getCarbohydrate())
        .sugar(productDTO.getSugar())
        .protein(productDTO.getProtein())
        .fat(productDTO.getFat())
        .transFat(productDTO.getTransFat())
        .saturatedFat(productDTO.getSaturatedFat())
        .cholesterol(productDTO.getCholesterol())
        .sodium(productDTO.getSodium())
        .calorie(productDTO.getCalorie())
        .link(productDTO.getLink())
        .category(Category.valueOf(productDTO.getCategory().toUpperCase()));

    // company_id로 회사(User) 정보 설정
    if (productDTO.getCompany_id() != null) {
      User company = userRepository.findById(productDTO.getCompany_id())
          .orElseThrow(() -> new IllegalArgumentException("해당 ID의 회사가 없습니다: " + productDTO.getCompany_id()));
      builder.company(company);
    }

    return builder.build();
  }

  @Override
  public List<ProductDTO> getProductsByCategoryAndFilter(String category, String filter) {
    List<Product> products;

    switch (category) {
      case "Taste":
        products = applyTasteFilter(filter);
        break;
      case "Sugar":
        products = applySugarFilter(filter);
        break;
      case "Protein":
        products = applyProteinFilter(filter);
        break;
      case "Calorie":
        products = applyCalorieFilter(filter);
        break;
      default:
        products = productRepository.findAll(); // 기본적으로 전체 제품 목록 반환
    }

    return products.stream()
        .map(this::entityToDto)
        .collect(Collectors.toList());
  }

  private List<Product> applyTasteFilter(String filter) {
    switch (filter) {
      case "추천순":
        return productRepository.findByIsRecommendedTrue();
      case "판매량순":
        return productRepository.findBySalesVolume();
      case "초코맛":
        return productRepository.findByTaste("초코맛");
      case "과일맛":
        return productRepository.findByTaste("과일맛");
      case "쿠키앤크림 맛":
        return productRepository.findByTaste("쿠키앤크림 맛");
      case "말차맛":
        return productRepository.findByTaste("말차맛");
      case "곡물맛":
        return productRepository.findByTaste("곡물맛");
      case "기타":
        return productRepository.findByTaste("기타");
      default:
        return productRepository.findAll();
    }
  }

  private List<Product> applySugarFilter(String filter) {
    switch (filter) {
      case "추천순":
        return productRepository.findByIsRecommendedTrue();
      case "판매량순":
        return productRepository.findBySalesVolume();
      case "당 5g 이하":
        return productRepository.findBySugarLessThanEqual(5);
      case "당 6g-10g":
        return productRepository.findBySugarBetween(6, 10);
      case "당 11g 이상":
        return productRepository.findBySugarGreaterThanEqual(11);
      default:
        return productRepository.findAll();
    }
  }

  private List<Product> applyProteinFilter(String filter) {
    switch (filter) {
      case "추천순":
        return productRepository.findByIsRecommendedTrue();
      case "판매량순":
        return productRepository.findBySalesVolume();
      case "단백질 20g 이상":
        return productRepository.findByProteinGreaterThanEqual(20);
      case "단백질 10g-19g":
        return productRepository.findByProteinBetween(10, 19);
      case "단백질 9g 이하":
        return productRepository.findByProteinLessThanEqual(9);
      default:
        return productRepository.findAll();
    }
  }

  private List<Product> applyCalorieFilter(String filter) {
    switch (filter) {
      case "추천순":
        return productRepository.findByIsRecommendedTrue();
      case "판매량순":
        return productRepository.findBySalesVolume();
      case "칼로리 200kcal 이하":
        return productRepository.findByCalorieLessThanEqual(200);
      case "칼로리 201kcal 이상":
        return productRepository.findByCalorieGreaterThanEqual(201);
      default:
        return productRepository.findAll();
    }
  }
}
