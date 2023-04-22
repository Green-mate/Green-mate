import * as API from '../api.js';
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.6/+esm';

const cards = document.querySelector('#item-cards-list');
const productCounter = document.querySelector('#product-counter');

function createCard(product) {
  return `
  <div id="card" style="width:350px; height:480px;" class="mb-5">
    <a id="card-link" href="/product-detail">
      <img
        src="${product.productImage}"
        id="card-img-top"
        class="rounded-lg"
        style="width:350px; height:376px;"
      />
      <div id="card-body">
        <div id="card-text card-title" class="text-lg mt-3 mb-1">
          ${product.productName}
        </div>
        <div id="card-text card-hashtags" class="text-gray-500 mt-1 mb-1">
          #${product.category}
        </div>
        <div id="card-text card-price" class="font-bold text-base mt-1 mb-1">
          ${product.productPrice} 원
        </div>
      </div>
    </a>
  </div>`;
}

getProductList();
async function getProductList() {
  ///api/products?category=분재&page=1&perPage=9
  // try{
  // const productList = await API.getWithoutToken('/api/products', `category=${categoryName}&page=${currentPage}&perPage=9`);
  const response = await axios.get('./productDummy.json');
  const products = await response.data;
  console.log(products.length);
  productCounter.innerText = products.length;
  console.log(products);

  // product 각 요소마다 createCard함수 호출,
  // 반환된 html을 cards요소에 추가해야하므로 forEach
  const productList = products.forEach((product) => {
    const newCard = createCard(product);
    cards.innerHTML += newCard;
  });
  return productList;
  // }
  // catch(err) {
  //   console.log(err.message);
  // }
}
