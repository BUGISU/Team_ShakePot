package com.example.api.repository;

import com.example.api.ApiApplication; // main 클래스 임포트
import com.example.api.entity.*;
import com.example.api.repository.*;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;

import jakarta.transaction.Transactional;

import java.util.Random;
import java.util.UUID;
import java.util.stream.IntStream;

@SpringBootTest(classes = ApiApplication.class) // main 클래스 지정
class FeedRepositoryTest {

  private static final Logger log = LoggerFactory.getLogger(FeedRepositoryTest.class);

  @Autowired
  FeedRepository feedRepository;

  @Autowired
  ProductRepository productRepository;

  @Autowired
  ImageRepository imageRepository;

  @Autowired
  ReviewRepository reviewRepository;

  @Autowired
  UserRepository userRepository;

  private static final String[] TASTES = {"chocolate", "fruit", "cookiesAndCream", "matcha", "grain","other"};
  private static final Random random = new Random();

  @Transactional
  @Commit
  @Test
  public void insertFeeds() {
    IntStream.rangeClosed(1, 100).forEach(i -> {
      Long uno = (long) (Math.random() * 100) + 1;
      Category category = determineCategory(i);

      // 랜덤 맛 선택
      String taste = TASTES[random.nextInt(TASTES.length)];
      log.info("Selected Taste: {}", taste);

      // Product 엔티티 생성 및 저장
      Product product = Product.builder()
          .pName("pName..." + i)
          .taste(taste)
          .carbohydrate(10 + i)
          .sugar(5 + i)
          .protein(8 + i)
          .fat(2 + i)
          .transFat(1 + i)
          .saturatedFat(1 + i)
          .cholesterol(20 + i)
          .sodium(300 + i)
          .calorie(120 + i)
          .price(i * 1000.0)
          .salesVolume(i * 10)
          .category(category)
          .company(Company.builder().uno(uno).build())
          .build();
      productRepository.save(product);

      // Feed 엔티티 생성 및 저장
      Feed feed = Feed.builder()
          .fName("fName..." + i)
          .fPrice((double) i * 1000)
          .product(product)
          .category(category)
          .status(FeedStatus.REGISTERED)
          .build();
      feedRepository.save(feed);

      // Consumer 조회 및 Review 저장
      userRepository.findById(uno).ifPresent(user -> {
        Consumer consumer = Consumer.builder()
            .uno(user.getUno())
            .email(user.getEmail())
            .build();

        Review review = Review.builder()
            .rContent("리뷰 내용..." + i)
            .rating(5)
            .likes((long) (Math.random() * 100) + 1)
            .product(product)
            .feed(feed)
            .consumer(consumer)
            .build();
        reviewRepository.save(review);
      });

      // Image 엔티티 생성 및 저장
      int cnt = (int) (Math.random() * 5) + 1;
      for (int j = 0; j < cnt; j++) {
        Image image = Image.builder()
            .uuid(UUID.randomUUID().toString())
            .imageName("test" + j + ".jpg")
            .product(product)
            .feed(feed)
            .build();
        imageRepository.save(image);
      }
    });
  }


  private Category determineCategory(int index) {
    if (index % 4 == 0) {
      return Category.CALORIE;
    } else if (index % 4 == 1) {
      return Category.TASTE;
    } else if (index % 4 == 2) {
      return Category.SUGAR;
    } else {
      return Category.PROTEIN;
    }
  }

}
