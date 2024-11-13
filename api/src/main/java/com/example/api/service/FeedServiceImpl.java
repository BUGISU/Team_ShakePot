package com.example.api.service;

import com.example.api.dto.FeedDTO;
import com.example.api.dto.PageRequestDTO;
import com.example.api.dto.PageResultDTO;
import com.example.api.dto.ProductDTO;
import com.example.api.entity.Feed;
import com.example.api.entity.Category;
import com.example.api.entity.FeedStatus;
import com.example.api.entity.Product;
import com.example.api.repository.FeedRepository;
import com.example.api.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.function.Function;
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FeedServiceImpl implements FeedService {

  private final FeedRepository feedRepository;
  private final ProductRepository productRepository;

  @Override
  public Long feedRegister(FeedDTO feedDTO) {
    Feed feed = dtoToEntity(feedDTO);
    Product product = productRepository.findById(feedDTO.getProduct().getPno())
            .orElseThrow(() -> new IllegalArgumentException("해당 ID를 가진 제품이 없습니다: " + feedDTO.getProduct().getPno()));

    feed.setProduct(product);
    feedRepository.save(feed);
    return feed.getFno();
  }

  @Override
  public FeedDTO getFeed(Long fno) {
    Feed feed = feedRepository.findById(fno)
            .orElseThrow(() -> new IllegalArgumentException("해당 ID를 가진 피드가 없습니다: " + fno));
    ProductDTO productDTO = entityToProductDto(feed.getProduct());
    FeedDTO feedDTO = entityToDto(feed);
    feedDTO.setProduct(productDTO);
    return feedDTO;
  }

  @Override
  public PageResultDTO<FeedDTO, Object[]> getList(PageRequestDTO pageRequestDTO) {
    Pageable pageable = pageRequestDTO.getPageable(Sort.by("fno").descending());
    Page<Object[]> result = feedRepository.getListByNewest(FeedStatus.REGISTERED, pageable);
    Function<Object[], FeedDTO> fn = (arr -> entityToDto((Feed) arr[0]));
    return new PageResultDTO<>(result, fn);
  }

  @Override
  public PageResultDTO<FeedDTO, Feed> getListByCategory(String category, PageRequestDTO pageRequestDTO) {
    Pageable pageable = pageRequestDTO.getPageable(Sort.by("fno").descending());
    Category categoryEnum = Category.valueOf(category.toUpperCase());
    Page<Feed> result = feedRepository.getListByCategory(categoryEnum, FeedStatus.REGISTERED, pageable);
    return new PageResultDTO<>(result, this::entityToDto);
  }

  // Sugar Filtering
  @Override
  public PageResultDTO<FeedDTO, Object[]> filterBySugar(String category, int minSugar, int maxSugar, PageRequestDTO pageRequestDTO) {
    return filterBySugar(category, minSugar, maxSugar, pageRequestDTO, "product.sugar");
  }

  @Override
  public PageResultDTO<FeedDTO, Object[]> filterBySugar(String category, int minSugar, int maxSugar, PageRequestDTO pageRequestDTO, String sortBy) {
    Sort sort = Sort.by(Sort.Order.desc(sortBy));
    Pageable pageable = pageRequestDTO.getPageable(sort);
    Category categoryEnum = Category.valueOf(category.toUpperCase());
    Page<Object[]> result = feedRepository.filterBySugar(categoryEnum, minSugar, maxSugar, pageable);
    Function<Object[], FeedDTO> fn = (arr -> entityToDto((Feed) arr[0]));
    return new PageResultDTO<>(result, fn);
  }

  @Override
  public PageResultDTO<FeedDTO, Feed> getFeedsBySugarAsc(PageRequestDTO pageRequestDTO) {
    Pageable pageable = pageRequestDTO.getPageable(Sort.by(Sort.Order.asc("product.sugar")));
    Page<Feed> result = feedRepository.findAll(pageable);
    Function<Feed, FeedDTO> fn = this::entityToDto;
    return new PageResultDTO<>(result, fn);
  }

  // Calorie Filtering
  @Override
  public PageResultDTO<FeedDTO, Object[]> filterByCalorie(String category, int minCalorie, int maxCalorie, PageRequestDTO pageRequestDTO) {
    return filterByCalorie(category, minCalorie, maxCalorie, pageRequestDTO, "product.calorie");
  }

  @Override
  public PageResultDTO<FeedDTO, Object[]> filterByCalorie(String category, int minCalorie, int maxCalorie, PageRequestDTO pageRequestDTO, String sortBy) {
    Sort sort = Sort.by(Sort.Order.desc(sortBy));
    Pageable pageable = pageRequestDTO.getPageable(sort);
    Category categoryEnum = Category.valueOf(category.toUpperCase());
    Page<Object[]> result = feedRepository.filterByCalorie(categoryEnum, minCalorie, maxCalorie, pageable);
    Function<Object[], FeedDTO> fn = (arr -> entityToDto((Feed) arr[0]));
    return new PageResultDTO<>(result, fn);
  }
  @Override
  public PageResultDTO<FeedDTO, Feed> getFeedsByCalorieAsc(PageRequestDTO pageRequestDTO) {
    Pageable pageable = pageRequestDTO.getPageable(Sort.by(Sort.Order.asc("product.calorie")));
    Page<Feed> result = feedRepository.findAll(pageable);

    Function<Feed, FeedDTO> fn = this::entityToDto;
    return new PageResultDTO<>(result, fn);
  }
  @Override
  public PageResultDTO<FeedDTO, Feed> getFeedsBySalesVolumeDesc(PageRequestDTO pageRequestDTO) {
    // 판매량을 기준으로 내림차순 정렬
    Pageable pageable = pageRequestDTO.getPageable(Sort.by(Sort.Order.desc("product.salesVolume")));
    // Repository에서 페이징된 전체 Feed 리스트를 조회
    Page<Feed> result = feedRepository.findAll(pageable);
    // Feed 엔티티를 FeedDTO로 변환하는 함수 정의
    Function<Feed, FeedDTO> fn = this::entityToDto;
    // PageResultDTO로 변환하여 반환
    return new PageResultDTO<>(result, fn);
  }

  // Protein Filtering
  @Override
  public PageResultDTO<FeedDTO, Object[]> filterByProtein(String category, int minProtein, int maxProtein, PageRequestDTO pageRequestDTO) {
    return filterByProtein(category, minProtein, maxProtein, pageRequestDTO, "product.protein");
  }

  @Override
  public PageResultDTO<FeedDTO, Object[]> filterByProtein(String category, int minProtein, int maxProtein, PageRequestDTO pageRequestDTO, String sortBy) {
    Sort sort = Sort.by(Sort.Order.desc(sortBy));
    Pageable pageable = pageRequestDTO.getPageable(sort);
    Category categoryEnum = Category.valueOf(category.toUpperCase());
    Page<Object[]> result = feedRepository.filterByProtein(categoryEnum, minProtein, maxProtein, pageable);
    Function<Object[], FeedDTO> fn = (arr -> entityToDto((Feed) arr[0]));
    return new PageResultDTO<>(result, fn);
  }

  @Override
  public PageResultDTO<FeedDTO, Feed> getFeedsByProteinDesc(PageRequestDTO pageRequestDTO) {
    Pageable pageable = pageRequestDTO.getPageable(Sort.by(Sort.Order.desc("product.protein")));
    Page<Feed> result = feedRepository.findAll(pageable);
    Function<Feed, FeedDTO> fn = this::entityToDto;
    return new PageResultDTO<>(result, fn);
  }


  // Taste Filtering
  @Override
  public PageResultDTO<FeedDTO, Object[]> filterByTaste(String category, List<String> tasteList, PageRequestDTO pageRequestDTO) {
    return filterByTaste(category, tasteList, pageRequestDTO, "fno");
  }

  @Override
  public PageResultDTO<FeedDTO, Object[]> filterByTaste(String category, List<String> tasteList, PageRequestDTO pageRequestDTO, String sortBy) {
    Sort sort = Sort.by(Sort.Order.desc(sortBy));
    Pageable pageable = pageRequestDTO.getPageable(sort);
    Category categoryEnum = Category.valueOf(category.toUpperCase());
    Page<Object[]> result = feedRepository.filterByTaste(categoryEnum, tasteList, pageable);
    Function<Object[], FeedDTO> fn = (arr -> entityToDto((Feed) arr[0]));
    return new PageResultDTO<>(result, fn);
  }

  @Override
  public PageResultDTO<FeedDTO, Object[]> getListPage(PageRequestDTO pageRequestDTO) {
    Pageable pageable = pageRequestDTO.getPageable(Sort.by("fno").descending());
    Page<Object[]> result = feedRepository.getListPage(pageable);
    Function<Object[], FeedDTO> fn = (en -> entityToDto((Feed) en[0]));
    return new PageResultDTO<>(result, fn);
  }

  @Override
  public Feed dtoToEntity(FeedDTO feedDTO) {
    Product product = productRepository.findById(feedDTO.getProduct().getPno())
            .orElseThrow(() -> new IllegalArgumentException("해당 ID를 가진 제품이 없습니다: " + feedDTO.getProduct().getPno()));
    return Feed.builder()
            .fno(feedDTO.getFno())
            .fName(feedDTO.getFName())
            .fPrice(feedDTO.getFPrice())
            .category(Category.valueOf(feedDTO.getCategory()))
            .status(FeedStatus.valueOf(feedDTO.getStatus()))
            .product(product)
            .build();
  }

  @Override
  public FeedDTO entityToDto(Feed feed) {
    ProductDTO productDTO = entityToProductDto(feed.getProduct());
    return FeedDTO.builder()
            .fno(feed.getFno())
            .fName(feed.getFName())
            .fPrice(feed.getFPrice())
            .category(feed.getCategory().name())
            .status(feed.getStatus().name())
            .product(productDTO)
            .build();
  }


  private ProductDTO entityToProductDto(Product product) {
    return ProductDTO.builder()
            .pno(product.getPno())
            .pName(product.getPName())
            .price(product.getPrice())
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
            .build();
  }
}
