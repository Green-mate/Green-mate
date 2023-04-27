import * as API from '../api.js';
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.6/+esm';

// const cards = document.querySelector('#item-cards-list');
const categoryNameLabel = document.querySelector('#category-name-label');
const productCounter = document.querySelector('#product-counter');

const urlParams = new URLSearchParams(window.location.search);
let page = parseInt(urlParams.get('page')) || 1;
let categoryPage = parseInt(urlParams.get('categoryPage')) || 1;

function createCard(product) {
  return `
  <div id="card" style="width:350px; height:480px;" class="mb-5">
    <a id="card-link" href="/product-detail?pid=${product.shortId}">
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

/********************* 전체상품 조회 && 페이지네이션 **********************/
async function getProductList() {
  const response = await axios.get(`/api/products?page=${page}&perPage=9`);
  const products = await response.data.pagenatedProducts.results;
  const productCount = await response.data.total;

  /** 스피너 삭제 **/
  const spinner = document.getElementById('spinner');
  spinner.innerHTML = `
  <section
  id="item-cards-list"
  class="grid grid-cols-3 justify-items-center items-center mb-50"
  style="width: 1200px"
></section>
  `;

  const cards = document.querySelector('#item-cards-list');
  const totalPages = Math.ceil(productCount / 9);
  // console.log(products);
  productCounter.innerText = productCount;

  const pageButtons = document.querySelector('#page-buttons');
  pageButtons.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const link = document.createElement('a');
    link.classList.add('mt-20', 'mb-10', 'mr-10', 'text-xl');
    link.href = `?page=${i}`;
    link.textContent = i;
    if (i === page) {
      link.classList.add('text-[#69b766]', 'font-bold');
    }
    pageButtons.appendChild(link);
  }

  // product 각 요소마다 createCard함수 호출하여 productList에 담음
  const productList = [];
  for (const product of products) {
    const newCard = createCard(product);
    cards.innerHTML += newCard;
    productList.push(product);
  }
  return productList;
}

/** 스피너 재생성 -> 카테고리 별 스피너 달기 위함 **/
const spinner = document.getElementById('spinner');
spinner.innerHTML = `
  <i
    id="spinner-icon"
    class="fa fa-spinner fa-spin"
    style="
      display: flex;
      font-size: 250px;
      justify-content: center;
      color: gainsboro;
      margin-top: 150px;
      margin-bottom: 150px;
    "
  ></i>`;

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

// 카테고리 클릭시 url업데이트
function updateUrl(categoryPage) {
  const clickedCategoryName = sessionStorage.getItem('selectedCategory');
  const newUrl = `?category=${clickedCategoryName}&categoryPage=${categoryPage}`;
  window.history.pushState(null, null, newUrl);
}

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
    categoryPage = 1;
    updateUrl(categoryPage);

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

/************카테고리별 상품 리스트 렌더링 함수 && 페이지네이션 ************/
// 카테고리 반환 값이 null or NaN이면, categoryPage에 기본적으로 1 할당

async function categoryFilter() {
  const clickedCategoryName = sessionStorage.getItem('selectedCategory');
  const searchByCategoryProductList = [];
  let products = [];
  try {
    const response = await axios.get(
      `/api/products/categories?category=${clickedCategoryName}&page=${categoryPage}&perPage=9`,
    );

    const spinner = document.getElementById('spinner');
    spinner.innerHTML = `
  <section
  id="item-cards-list"
  class="grid grid-cols-3 justify-items-center items-center mb-50"
  style="width: 1200px"
></section>
  `;

    const cards = document.querySelector('#item-cards-list');

    products = await response.data.pagenatedProducts.results;
    const productCount = await response.data.total;
    const totalPages = Math.ceil(productCount / 9);

    productCounter.innerText = productCount;

    const pageButtons = document.querySelector('#page-buttons');
    pageButtons.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const link = document.createElement('a');
      link.classList.add('mt-20', 'mb-10', 'mr-10', 'text-xl');
      link.href = `?category=${clickedCategoryName}&categoryPage=${i}`;

      link.textContent = i;

      if (i === categoryPage) {
        link.classList.add('text-[#69b766]', 'font-bold');
      }

      link.addEventListener('click', (e) => {
        e.preventDefault();
        categoryPage = i;
        updateUrl(categoryPage);
        categoryFilter();
      });

      pageButtons.appendChild(link);
    }

    products.forEach((product) => {
      searchByCategoryProductList.push(product);
    });

    if (searchByCategoryProductList.length === 0) {
      cards.innerHTML = `
    <div>
      <div id="empty-product-list" >상품이 없습니다.</div>
    </div>
    `;
    } else {
      cards.innerHTML = '';
      searchByCategoryProductList.forEach((product) => {
        const newCard = createCard(product);
        cards.innerHTML += newCard;
      });
    }
  } catch (err) {
    const cards = document.querySelector('#item-cards-list');
    cards.innerHTML = `
    <div class="col-start-1 col-end-4 pt-[150px] pb-[170px]" style="margin:0 auto">
      <div class="col-start-1 col-end-4 text-2xl font-semibold text-gray-500" id="empty-product-list" >상품이 없습니다.</div>
    </div>
    `;
    const pageButtons = document.querySelector('#page-buttons');
    pageButtons.innerHTML = '';
  }
}

wholeCategory.addEventListener('click', () => {
  sessionStorage.setItem('selectedCategory', 'all');
  categoryPage = 1;
  if (sessionStorage.getItem('selectedCategory') === 'all') {
    wholeCategory.classList.toggle('text-[#69b766]');
  }
});
