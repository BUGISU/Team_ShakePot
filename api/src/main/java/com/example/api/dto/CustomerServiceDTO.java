package com.example.api.dto;

import com.example.api.entity.CustomerService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerServiceDTO {
  private Long csno;         // 고객 서비스 요청 no
  private String csTitle;    // 고객 서비스 요청의 제목
  private String csContent;  // 요청의 내용
  private String csResponse; // 요청에 대한 관리자의 응답
  private Long uno;       // 요청을 한 사용자의 no
  private Long pno;       // 요청을 한 Product의 no
  private LocalDateTime regDate, modDate;
  private String email;      // 요청한 사용자의 이메일

  public static CustomerServiceDTO fromEntity(CustomerService customerService) {
    return CustomerServiceDTO.builder()
            .csno(customerService.getCsno())
            .csTitle(customerService.getCsTitle())
            .csContent(customerService.getCsContent())
            .csResponse(customerService.getCsResponse())
            .uno(customerService.getUser().getUno()) // 사용자 번호
            .email(customerService.getUser().getEmail()) // 사용자 이메일 추가
            .pno(customerService.getProduct() != null ? customerService.getProduct().getPno() : null)
            .regDate(customerService.getRegDate())
            .modDate(customerService.getModDate())
            .build();
  }

}