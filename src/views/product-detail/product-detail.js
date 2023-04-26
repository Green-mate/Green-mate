import * as API from '../api.js';
import { getUrlParams } from '/useful-functions.js';
import { addToDb, putToDb } from '../indexed-DB.js';

let productAmount = document.getElementById('product-amount');
let productAmountNum = parseInt(productAmount.textContent);

const totalAmount = document.getElementById('total-number');
const totalPrice = document.getElementById('total-price');

let TOTALPRICE = 0;
productAmountNum = 1;

// 상품 아이디 정보
const { pid } = getUrlParams();

getProductDetail();
async function getProductDetail() {
  const response = await API.getWithoutToken(`/api/products`, pid);
  console.log(response);
  const { category, productImage, productName, productPrice, stock } = response;

  /* 값 렌더링 */
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

  /* 장바구니 및 바로 구매 기능 */
  const orderBtn = document.getElementById('order-button');
  const cartBtn = document.getElementById('cart-button');
  const cartIcon = document.getElementById('cart-icon');

  cartBtn.addEventListener('click', async () => {
    try {
      await insertCart(response);
      alert('장바구니에 추가되었습니다!🧺');
    } catch (err) {
      if (err.message.includes('Key')) {
        alert('이미 장바구니에 추가되어 있습니다.');
      }
      console.log(err);
    }
  });

  orderBtn.addEventListener('click', async () => {
    try {
      await insertCart(response);
      window.location.replace('/order');
    } catch (err) {
      if (err.message.includes('Key')) {
        alert('이미 장바구니에 추가되어 있습니다.');
        window.location.replace('/order');
      }
      console.log(err);
    }
  });

  /** stock 0 이하일 때 렌더 **/
  //bg-[#69b766] hover:bg-green-700
  if (stock <= 0) {
    orderBtn.innerText = '품절된 상품입니다.';
    orderBtn.disabled = true;
    orderBtn.classList.remove('bg-[#69b766]', 'hover:bg-green-700');
    orderBtn.classList.add('bg-gray-400');
    cartBtn.disabled = true;
    cartIcon.classList.remove('text-[#69b766]');
    cartBtn.classList.remove('hover:border-[#69b766]', 'hover:border-2');

    cartBtn.classList.add('text-gray-400');
  }
}

async function insertCart(product) {
  const { _id: id, shortId, productPrice } = product;

  await addToDb('cart', { ...product, quantity: 1 }, id);

  await putToDb('order', 'total-order', (data) => {
    const totalCount = data.productsCount;
    const totalPrice = data.productsTotalPrice;
    const ids = data.ids;
    const shortIds = data.shortIds;
    const selectedIds = data.selectedIds;

    data.productsCount = totalCount ? totalCount + 1 : 1;
    data.productsTotalPrice = totalPrice
      ? totalPrice + productPrice
      : productPrice;
    data.ids = ids ? [...ids, id] : [id];
    data.shortIds = shortIds ? [...shortIds, shortId] : [shortId];
    data.selectedIds = selectedIds ? [...selectedIds, id] : [id];
  });
}
