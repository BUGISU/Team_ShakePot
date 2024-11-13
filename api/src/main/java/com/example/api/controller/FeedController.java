package com.example.api.controller;

import com.example.api.dto.FeedDTO;
import com.example.api.dto.PageRequestDTO;
import com.example.api.dto.PageResultDTO;
import com.example.api.dto.ProductDTO;
import com.example.api.entity.Feed;
import com.example.api.service.FeedService;
import com.example.api.service.ProductService;
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
@RequestMapping("/feed")
@RequiredArgsConstructor
public class FeedController {

  private final FeedService feedService;
  private final ProductService productService;

  @GetMapping("/list")
  public ResponseEntity<PageResultDTO<FeedDTO, Object[]>> getListPage(PageRequestDTO pageRequestDTO) {
    PageResultDTO<FeedDTO, Object[]> pageResult = feedService.getListPage(pageRequestDTO);
    return new ResponseEntity<>(pageResult, HttpStatus.OK);
  }

  @PostMapping("/register")
  public ResponseEntity<Long> feedRegister(@RequestBody FeedDTO feedDTO) {
    Long feedId = feedService.feedRegister(feedDTO);
    return ResponseEntity.ok(feedId);
  }

  // 최신순으로 피드 조회
  @GetMapping(value = "/newest", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Map<String, Object>> getNewestFeeds(PageRequestDTO pageRequestDTO) {
    Map<String, Object> result = new HashMap<>();
    result.put("pageResultDTO", feedService.getList(pageRequestDTO));
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  // 카테고리별 필터링된 피드 조회
  @GetMapping(value = "/category/{category}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Map<String, Object>> getListByCategory(@PathVariable String category, PageRequestDTO pageRequestDTO) {
    Map<String, Object> result = new HashMap<>();
    result.put("pageResultDTO", feedService.getListByCategory(category, pageRequestDTO));
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  // 칼로리 필터링 (추천순 포함)
  @GetMapping(value = "/filter/calorie", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Map<String, Object>> filterByCalorie(
      @RequestParam(defaultValue = "CALORIE") String category,
      @RequestParam(required = false) Integer minCalorie,
      @RequestParam(required = false) Integer maxCalorie,
      PageRequestDTO pageRequestDTO) {

    log.info("Calorie filter request: category={}, minCalorie={}, maxCalorie={}", category, minCalorie, maxCalorie);

    // 기본 범위 설정
    minCalorie = (minCalorie != null) ? minCalorie : 0;
    maxCalorie = (maxCalorie != null) ? maxCalorie : Integer.MAX_VALUE;

    Map<String, Object> result = new HashMap<>();
    if ("recommended".equalsIgnoreCase(category)) {
      // 추천순 (칼로리 오름차순)으로 필터링
      PageResultDTO<FeedDTO, Feed> recommendedResult = feedService.getFeedsByCalorieAsc(pageRequestDTO);
      result.put("pageResultDTO", recommendedResult);
    }
    else if ("salesVolume".equalsIgnoreCase(category)) {
      // 추천순 (칼로리 오름차순)으로 필터링
      PageResultDTO<FeedDTO, Feed> recommendedResult = feedService.getFeedsBySalesVolumeDesc(pageRequestDTO);
      result.put("pageResultDTO", recommendedResult);
    }
    else {
      // 기본 칼로리 필터링 수행
      PageResultDTO<FeedDTO, Object[]> calorieResult = feedService.filterByCalorie(category, minCalorie, maxCalorie, pageRequestDTO);
      result.put("pageResultDTO", calorieResult);
    }

    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  // 당류 필터링 (추천순 및 판매량 포함)
  @GetMapping(value = "/filter/sugar", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Map<String, Object>> filterBySugar(
      @RequestParam(defaultValue = "SUGAR") String category,
      @RequestParam(required = false) Integer minSugar,
      @RequestParam(required = false) Integer maxSugar,
      PageRequestDTO pageRequestDTO) {
    // 기본 범위 설정
    minSugar = (minSugar != null) ? minSugar : 0;
    maxSugar = (maxSugar != null) ? maxSugar : Integer.MAX_VALUE;

    Map<String, Object> result = new HashMap<>();
    if ("recommended".equalsIgnoreCase(category)) {
      // 추천순 (당류 내림차순)으로 필터링
      PageResultDTO<FeedDTO, Feed> recommendedResult = feedService.getFeedsBySugarAsc(pageRequestDTO);
      result.put("pageResultDTO", recommendedResult);
    } else if ("salesVolume".equalsIgnoreCase(category)) {
      // 판매량 (당류 내림차순)으로 필터링
      PageResultDTO<FeedDTO, Feed> salesVolumeResult = feedService.getFeedsBySalesVolumeDesc(pageRequestDTO);
      result.put("pageResultDTO", salesVolumeResult);
    } else {
      // 기본 당류 필터링 수행
      PageResultDTO<FeedDTO, Object[]> sugarResult = feedService.filterBySugar(category, minSugar, maxSugar, pageRequestDTO);
      result.put("pageResultDTO", sugarResult);
    }

    return new ResponseEntity<>(result, HttpStatus.OK);
  }
  // 단백질 필터링 (추천순 및 판매량 포함)
  @GetMapping(value = "/filter/protein", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Map<String, Object>> filterByProtein(
      @RequestParam(defaultValue = "PROTEIN") String category,
      @RequestParam(required = false) Integer minProtein,
      @RequestParam(required = false) Integer maxProtein,
      PageRequestDTO pageRequestDTO) {

    log.info("PROTEIN filter request: category={}, minProtein={}, maxProtein={}", category, minProtein, maxProtein);

    // 기본 범위 설정
    minProtein = (minProtein != null) ? minProtein : 0;
    maxProtein = (maxProtein != null) ? maxProtein : Integer.MAX_VALUE;

    Map<String, Object> result = new HashMap<>();
    if ("recommended".equalsIgnoreCase(category)) {
      log.info("Performing recommended filter by protein descending order");
      // 추천순 (단백질 내림차순)으로 필터링
      PageResultDTO<FeedDTO, Feed> recommendedResult = feedService.getFeedsByProteinDesc(pageRequestDTO);
      result.put("pageResultDTO", recommendedResult);
    } else if ("salesVolume".equalsIgnoreCase(category)) {
      log.info("Performing salesVolume filter by protein descending order");
      // 판매량 (단백질 내림차순)으로 필터링
      PageResultDTO<FeedDTO, Feed> salesVolumeResult = feedService.getFeedsBySalesVolumeDesc(pageRequestDTO);
      result.put("pageResultDTO", salesVolumeResult);
    } else {
      // 기본 단백질 필터링 수행
      PageResultDTO<FeedDTO, Object[]> proteinResult = feedService.filterByProtein(category, minProtein, maxProtein, pageRequestDTO);
      result.put("pageResultDTO", proteinResult);
    }
    return new ResponseEntity<>(result, HttpStatus.OK);
  }
  // 맛 필터링 (Taste) - 추천순 포함
  @GetMapping(value = "/filter/taste", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Map<String, Object>> filterByTaste(
      @RequestParam(defaultValue = "TASTE") String category,
      @RequestParam(required = false) List<String> tasteList,
      PageRequestDTO pageRequestDTO) {
    Map<String, Object> result = new HashMap<>();

    if ("salesVolume".equalsIgnoreCase(category)) {
      // 판매량
      log.info("Performing salesVolume filter by protein descending order");
      PageResultDTO<FeedDTO, Feed> salesVolumeResult = feedService.getFeedsBySalesVolumeDesc(pageRequestDTO);
      result.put("pageResultDTO", salesVolumeResult);
    }
    else {
      // 기본 맛 필터링 수행
      log.info("Performing taste filter with specified taste list");
      PageResultDTO<FeedDTO, Object[]> tasteResult = feedService.filterByTaste(category, tasteList, pageRequestDTO);
      result.put("pageResultDTO", tasteResult);
    }
    return new ResponseEntity<>(result, HttpStatus.OK);
  }
  // 개별 피드 조회
  @GetMapping(value = "/read/{fno}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Map<String, Object>> getFeed(@PathVariable("fno") Long fno) {
    log.info("Received fno: {}", fno);
    FeedDTO feedDTO = feedService.getFeed(fno);
    log.info("FeedDTO: {}", feedDTO);

    ProductDTO productDTO = productService.getProductById(feedDTO.getProduct().getPno());
    log.info("ProductDTO: {}", productDTO);

    Map<String, Object> result = new HashMap<>();
    result.put("feedDTO", feedDTO);
    result.put("productDTO", productDTO);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }
}
