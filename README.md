# 🥤 Team ShakePot

> **내 몸에 딱 맞는 영양 솔루션**  
> 단백질 쉐이크에 대한 포괄적인 정보 제공 플랫폼 (Team Project)  
> 사용자와 공급자 간의 중간 다리 역할을 수행하는 웹 기반 서비스

## 📅 개발 기간
- 2024.10.03 ~ 2024.11

## ⚙️ 개발 환경
- **Backend**: Spring Boot, Spring Security, Maven  
- **Frontend**: React, styled-components  
- **Database**: MySQL, MariaDB  
- **Tools**: Figma, IntelliJ, VSCode  
- **Team Size**: 3명  

## 👨‍💻 담당 역할
- Spring Boot 기반 **서버 개발 및 API 설계**  
- React 기반 **UI/UX 구현** (메인·Taste·Sugar·Protein·Calorie 페이지)  
- **고객센터(Q&A) 문의 관리** (등록·수정·조회 기능 / 사용자 권한 제어 적용)  
- **상품 데이터 Fetch API 연동** 및 조건별 필터링 기능 구현  
- **페이징 처리**로 대량 데이터 효율적 분할 표시  
- **JWT 인증 및 권한 관리** (Admin, User, Consumer, Company 권한별 접근 제어)  
- **동적 Header 구성**: 로그인 여부에 따른 메뉴 표시 (로그인/로그아웃/마이페이지)  

## 📂 프로젝트 화면

<table>
  <tr>
    <td align="center"><b>메인 화면</b><br><img src="Screenshots/그림14.png" width="250"/></td>
    <td align="center"><b>서비스 플로우</b><br><img src="Screenshots/그림15.png" width="250"/></td>
    <td align="center"><b>데이터베이스 ERD</b><br><img src="Screenshots/그림16.png" width="250"/></td>
  </tr>
  <tr>
    <td align="center"><b>카테고리 페이지</b><br><img src="Screenshots/그림7.png" width="250"/></td>
    <td align="center"><b>상품 목록 (Sugar)</b><br><img src="Screenshots/그림8.png" width="250"/></td>
    <td align="center"><b>상품 상세</b><br><img src="Screenshots/그림9.png" width="250"/></td>
  </tr>
  <tr>
    <td align="center"><b>Q&A 목록</b><br><img src="Screenshots/그림11.png" width="250"/></td>
    <td align="center"><b>Q&A 상세</b><br><img src="Screenshots/그림12.png" width="250"/></td>
    <td align="center"><b>Q&A 작성</b><br><img src="Screenshots/그림13.png" width="250"/></td>
  </tr>
</table>


## 🔑 주요 기능
- **회원 인증**: JWT 기반 로그인/권한 제어  
- **상품 관리**: 조건별 필터링 및 페이징 처리된 리스트 제공  
- **문의 게시판**: 사용자 권한에 따른 등록·조회·수정 가능  
- **UI/UX 최적화**: 반응형 화면 구성 및 styled-components 활용  

