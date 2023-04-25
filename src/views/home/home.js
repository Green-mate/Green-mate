import * as API from '../api.js';
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.6/+esm';

const cards = document.querySelector('#item-cards-list');
const card = document.querySelector('#cards');
const categoryNameLabel = document.querySelector('#category-name-label');
const productCounter = document.querySelector('#product-counter');
const searchByCategoryProduct = [];

function createCard(product) {
  return `
  <div id="card" style="width:350px; height:480px;" class="mb-5">
    <a id="card-link" href="/product-detail?pid=${product.id}">
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
  const response = await axios.get(`/api/products?page=1&perPage=92`);
  const products = await response.data.pagenatedProducts.results;
  const productCount = await response.data.total;

  productCounter.innerText = productCount;

  // product 각 요소마다 createCard함수 호출하여 productList에 담음
  const productList = [];
  for (const product of products) {
    const newCard = createCard(product);
    cards.innerHTML += newCard;
    productList.push(product);
  }
  return productList;
}

/************카악퉤고리***********/
const categoryBar = document.querySelector('#category-menu-navbar');
const wholeCategory = document.querySelector('#whole-product-category');

// 초기 sessionStorage
sessionStorage.setItem('selectedCategory', 'all');

// 카테고리 데이터 받아와서 동적 생성
const categories = await API.getWithoutToken('/api/admin/categories');

categories.map((category) => {
  createCategory(category);
});

// 전체 상품 이외 생성될 카테고리
function createCategory({ categoryName }) {
  const categoryElem = document.createElement('li');
  const categoryLinkElem = document.createElement('a');

  // 하나의 카테고리 속성 부여
  categoryLinkElem.textContent = categoryName;
  categoryLinkElem.classList.add('cursor-pointer');
  categoryElem.classList.add('text-lg', 'font-bold', 'hover:text-[#69b766]');
  categoryElem.setAttribute('id', 'category');

  // 카테고리 element 동적 생성
  categoryElem.appendChild(categoryLinkElem);

  /**
   * 카테고리 클릭시, 클릭한 카테고리 이름 세션 스토리지에 저장
   * 클릭한 카테고리 text색상 및 sessionStorage변경, 카테고리 명 변경
   */
  categoryElem.addEventListener('click', () => {
    sessionStorage.setItem('selectedCategory', categoryName);
    categoryNameLabel.innerText = categoryName;
    const categoryLiList = document.querySelectorAll('#category');
    categoryLiList.forEach((categoryLi) => {
      if (sessionStorage.getItem('selectedCategory') !== 'all') {
        wholeCategory.classList.remove('text-[#69b766]');
      }
      categoryLi.children[0].classList.remove('text-[#69b766]');
    });
    categoryLinkElem.classList.add('text-[#69b766]');
    categoryFilter();
  });

  categoryBar.appendChild(categoryElem);
}

/************카테고리별 상품 리스트 렌더링 함수 ************/
async function categoryFilter() {
  const clickedCategoryName = sessionStorage.getItem('selectedCategory');
  const searchByCategoryProductList = [];

  const response = await axios.get(
    `/api/products/categories?category=${clickedCategoryName}&page=1&perPage=39`,
  );
  console.log(response);
  const products = await response.data.pagenatedProducts.results;
  const productCount = await response.data.total;
  productCounter.innerText = productCount;

  products.forEach((product) => {
    searchByCategoryProductList.push(product);
    if (
      product.category.includes(clickedCategoryName) ||
      clickedCategoryName === 'all'
    ) {
      searchByCategoryProductList.push(product);
    }
  });

  if (searchByCategoryProductList.length === 0) {
    cards.innerHTML = `
    <div></div>
      <div id="empty-product-list" >상품이 없습니다.</div>
    `;
  } else {
    cards.innerHTML = '';
    searchByCategoryProductList.forEach((product) => {
      const newCard = createCard(product);
      cards.innerHTML += newCard;
    });
  }
}

wholeCategory.addEventListener('click', () => {
  sessionStorage.setItem('selectedCategory', 'all');

  if (sessionStorage.getItem('selectedCategory') === 'all') {
    wholeCategory.classList.toggle('text-[#69b766]');
  }
});
