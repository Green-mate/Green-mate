// const createCategory = (category) => {
//   return `
//         <li class="nav-item category">
//           <div class="nav-link">#${category.name}</div>
//         </li>`;
// };

const cards = document.querySelector('#item-cards-list');
const productCounter = document.querySelector('#product-counter');
const card = document.querySelector('#card');

const createCard = () => {
  return ` <div id="card">
  <a class="card-link" href="#">
    <img
      src="../dist/example.jpeg"
      id="card-img-top"
      class="rounded-lg"
      width="350" height="376"
    />
    <div id="card-body">
      <div id="card-text card-title" class="text-lg">
        하얗게 피어난 얼음꽃
      </div>
      <div id="card-text card-hashtags" class="text-gray-500">
        #관엽/공기정화식물
      </div>
      <div id="card-text card-price" class="font-bold text-base">
        14,000 원
      </div>
    </div>
  </a>
</div>`;
};

// 임시로 화면에 뿌리는 것임 UI상 어케 보이나
for (let i = 0; i <= 10; i++) {
  cards.innerHTML += createCard();
}

// const createCard = (item) => {
//   return `<div id="item-cards-list">
//     <a class="card-link" href='/products/${item._id}'>
//       <img src="${item.smallImageURL}" class="card-img-top" alt="${
//     item.name
//   }" />
//       <div class="card-body">
//       <div class="card-text card-title">${item.name}</div>
//       <div class="card-text card-hashtags">${item.category}</div>
//       <div class="card-text card-price">₩ ${addCommas(item.price)}</div>
//       </div>
//     </a>
//     </div>
//   </div>`;
// };

// // 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// // 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// // 코드 예시를 남겨 두었습니다.

// import * as Api from "/api.js";
// import { randomId } from "/useful-functions.js";

// // 요소(element), input 혹은 상수
// const landingDiv = document.querySelector("#landingDiv");
// const greetingDiv = document.querySelector("#greetingDiv");

// addAllElements();
// addAllEvents();

// // html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
// async function addAllElements() {
//   insertTextToLanding();
//   insertTextToGreeting();
// }

// // 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
// function addAllEvents() {
//   landingDiv.addEventListener("click", alertLandingText);
//   greetingDiv.addEventListener("click", alertGreetingText);
// }

// function insertTextToLanding() {
//   landingDiv.insertAdjacentHTML(
//     "beforeend",
//     `
//       <h2>n팀 쇼핑몰의 랜딩 페이지입니다. 자바스크립트 파일에서 삽입되었습니다.</h2>
//     `
//   );
// }

// function insertTextToGreeting() {
//   greetingDiv.insertAdjacentHTML(
//     "beforeend",
//     `
//       <h1>반갑습니다! 자바스크립트 파일에서 삽입되었습니다.</h1>
//     `
//   );
// }

// function alertLandingText() {
//   alert("n팀 쇼핑몰입니다. 안녕하세요.");
// }

// function alertGreetingText() {
//   alert("n팀 쇼핑몰에 오신 것을 환영합니다");
// }

// async function getDataFromApi() {
//   // 예시 URI입니다. 현재 주어진 프로젝트 코드에는 없는 URI입니다.
//   const data = await Api.get("/api/user/data");
//   const random = randomId();

//   console.log({ data });
//   console.log({ random });
// }
