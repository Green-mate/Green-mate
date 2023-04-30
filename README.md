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
-Google Cloud

# Collaboration Tools

- Notion
- Postman
- Discode
- Figma

# Contributors

| 이름 | 역할 | 담당 기능 |
| ------ | ------ | ------ |
| 신하영 | FE, 팀장 | 페이지 레이아웃, 회원가입/로그인/회원정보 수정,탈퇴 기능, 홈화면/카테고리/상품 상세보기 기능, IndexedDB 주문 기능, 주문정보조회/수정/삭제 기능, 페이지네이션, 스피너 |
| 진호병 | FE | 내용 |
| 김마리나 | BE | 상품 스키마 및 모델 구현, 상품 restAPI 설계 및 CRUD 기능 구현, 페이지네이션 기능 구현, 한글 인코더-디코더 유틸 작성, Logger 기능 구현, MongoDB 한국시간대 추가 |
| 류한나 | BE | 내용 |
| 류이서 | BE | 내용 |


# Infra Structure

# Features

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
