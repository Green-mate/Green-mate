import * as API from '../api.js';
import { getUrlParams } from '/useful-functions.js';

const image = document.getElementById('card-img-top');
const productPrice = document.getElementById('product-price');
const categorySmall = document.getElementById('category-name');

let productAmount = document.getElementById('product-amount');
let productAmountNum = parseInt(productAmount.textContent);

const totalAmount = document.getElementById('total-number');
const totalPrice = document.getElementById('total-price');

const purchaseBtn = document.getElementById('purchase-btn');
const cartBtn = document.getElementById('cart-btn');

const categoryInfo = document.getElementById('product-category-info');
const productAmountInfo = document.getElementById('product-amount-info');

let TOTALPRICE = 0;
productAmountNum = 1;

document.querySelector('#button-plus').addEventListener('click', () => {
  productAmountNum += 1;
  productAmount.textContent = productAmountNum;
  TOTALPRICE = productAmountNum * 3000;
  totalAmount.innerText = productAmountNum;
  totalPrice.innerText = TOTALPRICE;
});
document.querySelector('#button-minus').addEventListener('click', () => {
  productAmountNum -= 1;
  if (productAmountNum <= 1) {
    productAmountNum = 1;
    TOTALPRICE = productAmountNum * 3000;
  }
  productAmount.textContent = productAmountNum;
  TOTALPRICE = productAmountNum * 3000;
  totalAmount.innerText = productAmountNum;
  totalPrice.innerText = TOTALPRICE;
});

TOTALPRICE += productAmountNum * 3000;
totalAmount.innerText = productAmountNum;
totalPrice.innerText = TOTALPRICE;

async function getProductDetail() {
  // const { pid } = getUrlParams();
  // api/products/:shortId
  // const product =
}
