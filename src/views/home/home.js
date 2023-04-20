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
  return ` 
  <div id="card" style="width:350px; height:480px;">
    <a id="card-link" href="/product-detail">
      <img
        src="../dist/example.jpeg"
        id="card-img-top"
        class="rounded-lg"
        width="350" height="376"
      />
      <div id="card-body">
        <div id="card-text card-title" class="text-lg mt-3 mb-1">
          하얗게 피어난 얼음꽃
        </div>
        <div id="card-text card-hashtags" class="text-gray-500 mt-1 mb-1">
          #관엽/공기정화식물
        </div>
        <div id="card-text card-price" class="font-bold text-base mt-1 mb-1">
          14,000 원
        </div>
      </div>
    </a>
  </div>`;
};

// 임시로 화면에 뿌리는 것임 UI상 어케 보이나
for (let i = 0; i < 9; i++) {
  cards.innerHTML += createCard();
}
