import * as API from '../api.js';
import { getUrlParams } from '/useful-functions.js';

// const image = document.getElementById('card-img-top');
// const productPriceText = document.getElementById('product-price');
// const categorySmall = document.getElementById('category-name');

let productAmount = document.getElementById('product-amount');
let productAmountNum = parseInt(productAmount.textContent);

const totalAmount = document.getElementById('total-number');
const totalPrice = document.getElementById('total-price');

const purchaseBtn = document.getElementById('purchase-btn');
const cartBtn = document.getElementById('cart-btn');

// const categoryInfo = document.getElementById('product-category-info');
// const productAmountInfo = document.getElementById('product-amount-info');

let TOTALPRICE = 0;
productAmountNum = 1;

// 상품 아이디 정보
const param = getUrlParams();
const pid = param.pid;

getProductDetail();
async function getProductDetail() {
  const response = await API.getWithoutToken(`/api/products`, pid);
  const { category, productImage, productName, productPrice, stock } = response;

  const name = document.getElementById('product-name');
  const image = document.getElementById('card-img-top');
  const productPriceText = document.getElementById('product-price');

  const categorySmall = document.getElementById('category-name');
  const categoryInfo = document.getElementById('product-category-info');
  const productAmountInfo = document.getElementById('product-amount-info');

  image.setAttribute('src', productImage);
  name.textContent = productName;
  productPriceText.textContent = productPrice;
  categorySmall.textContent = `# ${category}`;
  categoryInfo.textContent = category;
  productAmountInfo.textContent = stock;

  // 재고 수량 카운트 버튼 && 총 상품 금액 계산
  document.querySelector('#button-plus').addEventListener('click', () => {
    productAmountNum += 1;
    productAmount.textContent = productAmountNum;
    TOTALPRICE = productAmountNum * productPrice;
    totalAmount.innerText = productAmountNum;
    totalPrice.innerText = TOTALPRICE;
  });
  document.querySelector('#button-minus').addEventListener('click', () => {
    productAmountNum -= 1;
    if (productAmountNum <= 1) {
      productAmountNum = 1;
      TOTALPRICE = productAmountNum * productPrice;
    }
    productAmount.textContent = productAmountNum;
    TOTALPRICE = productAmountNum * productPrice;
    totalAmount.innerText = productAmountNum;
    totalPrice.innerText = TOTALPRICE;
  });

  TOTALPRICE += productAmountNum * productPrice;
  totalAmount.innerText = productAmountNum;
  totalPrice.innerText = TOTALPRICE;
}
