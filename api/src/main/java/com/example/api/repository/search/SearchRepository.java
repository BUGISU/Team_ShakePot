package com.example.api.repository.search;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SearchRepository {

  // 타입과 키워드를 기반으로 검색 결과를 페이징 처리하여 반환하는 메서드
  Page<Object[]> searchPage(String type, String keyword, Pageable pageable);
}
