# Green-mate

“안녕하세요👋 식물을 쉽게 살 수 있는 쇼핑몰, 그린메이트입니다!🪴”

# Description

[그린메이트](http://kdt-sw-4-team08.elicecoding.com/)

# Tech Stack

### FRONT-END

- HTML
- tailwindCSS
- Vanilla js
- axios

### BACK-END

- node.js
- express.js
- MongoDB / mongoose
- BABEL
- multer
- morgan / winston
- nanoid

### AUT

- bcrypt
- JWT

### DEPLOY

- PM2
- NginX

### HOSTING

- Google Cloud

# Collaboration Tools

- Notion
- Postman
- Discode
- Figma

# Contributors

| 이름     | 역할     | 담당 기능                                                                                                                                                            |
| -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 신하영   | FE, 팀장 | 페이지 레이아웃, 회원가입/로그인/회원정보 수정,탈퇴 기능, 홈화면/카테고리/상품 상세보기 기능, IndexedDB 주문 기능, 주문정보조회/수정/삭제 기능, 페이지네이션, 스피너 |
| 진호병   | FE       | 페이지 레이아웃, indexedDB 장바구니 기능, 관리자 페이지 (주문, 카테고리, 제품 관리 ...), 페이지네이션                                                                                                                                                                  |
| 김마리나 | BE       | 상품 스키마 및 모델 구현, 상품 restAPI 설계 및 CRUD 기능 구현, 페이지네이션 기능 구현, 한글 인코더-디코더 유틸 작성, Logger 기능 구현, MongoDB 한국시간대 추가       |
| 류한나   | BE       | jwt토큰 활용 로그인 인증 구현, 유저/주문 스키마 및 모델 구현, 유저 / 주문 rest API 설계 및 CRUD 기능 구현, async handling middleware 구현 , VM 활용 서버 배포        |
| 류이서   | BE       | 카테고리 스키마 및 모델 구현, 카테고리 rest API 설계 및 CRUD 기능 구현, open API data 가공, 상품 추가 multer기능 구현                                                |

# Infra Structure

<img width="1156" alt="Screenshot 2023-05-02 at 4 07 15 PM" src="https://user-images.githubusercontent.com/77577434/235643520-accdfe18-5e58-4a61-8859-49e988ef8a7d.png">

# Features
<details>
<summary>회원가입 및 로그인</summary>
<div markdown="1">       

![회원가입 및 로그인](https://user-images.githubusercontent.com/77577434/235638563-15830100-d3c0-427d-bace-ccb30d4a6b57.gif)

</div>
</details>

<details>
<summary>회원정보 수정 및 탈퇴</summary>
<div markdown="1">       


![회원정보 수정 및 탈퇴](https://user-images.githubusercontent.com/77577434/235638618-e46682b4-1ebe-4aee-b417-3ae4eb2a302e.gif)

</div>
</details>


<details>
<summary>관리자</summary>
<div markdown="1">       


![관리자](https://user-images.githubusercontent.com/77577434/235637989-18d5e717-4006-4674-8a93-46f1f0071fa2.gif)

</div>
</details>


<details>
<summary>카테고리 별 페이지</summary>
<div markdown="1">       


![페이지네이션 3](https://user-images.githubusercontent.com/77577434/235640812-0fcb5154-3bd2-4821-beb1-3f93a2f5e359.gif)


</div>
</details>



<details>
<summary>장바구니 기능</summary>
<div markdown="1">       

![장바구니](https://user-images.githubusercontent.com/77577434/235642285-72da6e19-321e-46ab-88c0-d675b2c85830.gif)

</div>
</details>


<details>
<summary>제품 구매 기능</summary>
<div markdown="1">       

![제품 구매 기능](https://user-images.githubusercontent.com/77577434/235642957-be4286f1-1ff7-4e93-acad-afa9b01b3584.gif)

</div>
</details>


<details>
<summary>주문 수정 및 삭제</summary>
<div markdown="1">       

![주문 수정 및 삭제](https://user-images.githubusercontent.com/77577434/235643110-9fbd6974-53fe-4dde-a2eb-8c53cd13d1c7.gif)


</div>
</details>


# Directory Structure

- 프론트: src/views 폴더
- 백: src/views 이외 폴더 전체
- 실행: 프론트, 백 동시에, express로 실행
  <img width="745" alt="image" src="https://user-images.githubusercontent.com/70371342/235345484-b145a882-7d1b-47da-bb75-160219f28b86.png">

# Convention

## 코드 컨벤션

- 변수명, 함수명 : 카멜 케이스(camelCase)
- 파일명, css선택자 : 케밥 케이스(kebab-case)
- RESTFUL url : 케밥 케이스(kebab-case)

## 커밋 컨벤션

- feat : 새로운 기능 추가
- fix : 버그 수정
- docs : 문서 수정
- style : 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
- refactor : 코드 리펙토링
- test : 테스트 코드, 리펙토링 테스트 코드 추가
- chore : 빌드 업무 수정, 패키지 매니저 수정

## 브랜치 전략

<img width="1000" alt="image" src="https://user-images.githubusercontent.com/70371342/235344900-5610d17f-3224-4eec-93f6-d443bb487a39.png">

# 실행 방법

```
git clone {.....repository_name}.git
cd {repository_name}
npm install
npm run dev
npm run start
```

# .env설정

```
MONGODB_URL={YOUR_MONGODB_URL}
PORT={PORT}
JWT_SECERT_KEY={YOUR_JWT_SECRET_KEY}
```
