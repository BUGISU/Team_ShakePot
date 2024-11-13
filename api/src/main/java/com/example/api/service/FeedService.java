package com.example.api.service;

import com.example.api.dto.FeedDTO;
import com.example.api.dto.PageRequestDTO;
import com.example.api.dto.PageResultDTO;
import com.example.api.entity.Category;
import com.example.api.entity.Feed;
import com.example.api.entity.FeedStatus;

import java.util.List;

public interface FeedService {

  Long feedRegister(FeedDTO feedDTO);  // 피드 등록

  PageResultDTO<FeedDTO, Object[]> getList(PageRequestDTO pageRequestDTO);  // 전체 목록 조회 (기본 최신순)

  PageResultDTO<FeedDTO, Feed> getListByCategory(String category, PageRequestDTO pageRequestDTO);  // 카테고리별 목록 조회

  // 추천순 필터링
  PageResultDTO<FeedDTO, Object[]> filterBySugar(String category, int minSugar, int maxSugar, PageRequestDTO pageRequestDTO);  // 당류 필터링
  PageResultDTO<FeedDTO, Object[]> filterBySugar(String category, int minSugar, int maxSugar, PageRequestDTO pageRequestDTO, String sortBy);
  PageResultDTO<FeedDTO, Feed> getFeedsBySugarAsc(PageRequestDTO pageRequestDTO);

  PageResultDTO<FeedDTO, Object[]> filterByCalorie(String category, int minCalorie, int maxCalorie, PageRequestDTO pageRequestDTO);  // 칼로리 필터링
  PageResultDTO<FeedDTO, Object[]> filterByCalorie(String category, int minCalorie, int maxCalorie, PageRequestDTO pageRequestDTO, String sortBy);
  PageResultDTO<FeedDTO, Feed> getFeedsByCalorieAsc(PageRequestDTO pageRequestDTO);
  PageResultDTO<FeedDTO, Feed> getFeedsBySalesVolumeDesc(PageRequestDTO pageRequestDTO);

  PageResultDTO<FeedDTO, Object[]> filterByProtein(String category, int minProtein, int maxProtein, PageRequestDTO pageRequestDTO);  // 단백질 필터링
  PageResultDTO<FeedDTO, Object[]> filterByProtein(String category, int minProtein, int maxProtein, PageRequestDTO pageRequestDTO, String sortBy);
  PageResultDTO<FeedDTO, Feed> getFeedsByProteinDesc(PageRequestDTO pageRequestDTO);

  PageResultDTO<FeedDTO, Object[]> filterByTaste(String category, List<String> tasteList, PageRequestDTO pageRequestDTO);  // 맛 필터링
  PageResultDTO<FeedDTO, Object[]> filterByTaste(String category, List<String> tasteList, PageRequestDTO pageRequestDTO, String sortBy);  // 맛 필터링

  FeedDTO getFeed(Long fno);  // 특정 피드 조회

  // 피드 리스트 페이지 가져오기
  PageResultDTO<FeedDTO, Object[]> getListPage(PageRequestDTO pageRequestDTO);

  // DTO -> 엔티티 변환
  Feed dtoToEntity(FeedDTO feedDTO);

  // 엔티티 -> DTO 변환
  FeedDTO entityToDto(Feed feed);

}
