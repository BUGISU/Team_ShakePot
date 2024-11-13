package com.example.api.repository;

import com.example.api.entity.CustomerService;
import com.example.api.entity.User;
import com.example.api.entity.Product;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.stream.IntStream;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CustomerServiceRepositoryTests {

  @Autowired
  CustomerServiceRepository customerServiceRepository;

  @Autowired
  UserRepository userRepository;

  @Test
  public void insertCustomerService() {
    IntStream.rangeClosed(1, 200).forEach(i -> {
      Long pno = (long) (Math.random() * 100) + 1;
      Long uno = (long) (Math.random() * 100) + 1;

      // uno로 이메일을 조회
      String email = userRepository.findEmailByUno(uno);
      System.out.println("Searching for email with uno: " + uno + ", Found: " + email);

      if (email != null) {  // 해당 유저의 이메일이 존재하는 경우에만 진행
        CustomerService customerService = CustomerService.builder()
                .user(User.builder().uno(uno).email(email).build())  // uno와 이메일을 함께 설정
                .product(Product.builder().pno(pno).build())
                .csTitle("문의사항....." + i)
                .csContent("정말 궁금해요..." + i)
                .csResponse("그건 말이요..." + i)

                .build();

        customerServiceRepository.save(customerService);
      } else {
        System.out.println("User with ID " + uno + " not found");
      }
    });
  }
}
