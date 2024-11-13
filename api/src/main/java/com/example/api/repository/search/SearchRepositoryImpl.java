package com.example.api.repository.search;

import com.example.api.entity.Feed;
import com.example.api.entity.QFeed;
import com.example.api.entity.QImage;
import com.example.api.entity.QReview;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.JPQLQuery;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;
import java.util.stream.Collectors;

@Log4j2
public class SearchRepositoryImpl extends QuerydslRepositorySupport implements SearchRepository {

  // 생성자
  public SearchRepositoryImpl() {
    super(Feed.class);
  }

  // searchPage 메서드 구현, 타입과 키워드를 기반으로 동적 검색을 수행하는 메서드
  @Override
  public Page<Object[]> searchPage(String type, String keyword, Pageable pageable) {

    log.info("searchPage...............");

    // QueryDSL로 사용할 Q 도메인 생성
    QFeed feed = QFeed.feed;
    QImage image = QImage.image;
    QReview review = QReview.review;

    // JPQL 쿼리 생성 (feed를 기준으로)
    JPQLQuery<Feed> jpqlQuery = from(feed);
    jpqlQuery.leftJoin(image).on(image.feed.eq(feed));  // 피드와 이미지 조인
    jpqlQuery.leftJoin(review).on(review.feed.eq(feed));  // 피드와 리뷰 조인

    // select 절에서 Tuple로 결과를 선택 (likes와 review의 총 리뷰 수를 선택)
    JPQLQuery<Tuple> tuple = jpqlQuery.select(feed, image, review.likes, review.count());

    // BooleanBuilder를 이용하여 기본 조건 설정
    BooleanBuilder booleanBuilder = new BooleanBuilder();
    BooleanExpression expression = feed.fno.gt(0L);  // fno가 0보다 큰 조건
    booleanBuilder.and(expression);

    // 타입에 따른 검색 조건 추가
    if (type != null) {
      String[] typeArr = type.split("");  // t, w, c 등으로 나누어 처리
      BooleanBuilder conditionBuilder = new BooleanBuilder();
      for (String t : typeArr) {
        switch (t) {
          case "t":  // 피드 이름으로 검색
            conditionBuilder.or(feed.fName.contains(keyword));
            break;
          case "c":  // 리뷰 내용으로 검색
            conditionBuilder.or(review.rContent.contains(keyword));
            break;
        }
      }
      booleanBuilder.and(conditionBuilder);
    }

    // BooleanBuilder를 쿼리에 추가
    tuple.where(booleanBuilder);

    // 정렬 처리
    Sort sort = pageable.getSort();
    sort.stream().forEach(order -> {
      Order direction = order.isAscending() ? Order.ASC : Order.DESC;
      String prop = order.getProperty();
      PathBuilder orderByExpression = new PathBuilder(Feed.class, "feed");
      tuple.orderBy(new OrderSpecifier<>(direction, orderByExpression.get(prop)));
    });

    // 페이징 처리
    tuple.offset(pageable.getOffset());
    tuple.limit(pageable.getPageSize());

    // 결과 리스트 가져오기
    List<Tuple> result = tuple.fetch();

    // 총 데이터 수
    long count = tuple.fetchCount();

    // 결과를 PageImpl 객체로 반환
    return new PageImpl<>(result.stream().map(t -> t.toArray()).collect(Collectors.toList()), pageable, count);
  }
}
