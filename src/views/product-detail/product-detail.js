import * as API from '../api.js';
import { getUrlParams } from '/useful-functions.js';
import { addToDb, putToDb } from '../indexed-DB.js';

// 상품 아이디 정보
const { pid } = getUrlParams();

getProductDetail();
async function getProductDetail() {
  const response = await API.getWithoutToken(`/api/products`, pid);
  console.log(response);
  const { category, productImage, productName, productPrice, stock } = response;

  /* 스피너 돌아간 후 값 받는 거 성공하면 렌더링 */
  let container = document.getElementById('spinner-main-container');
  container.innerHTML = `
    <section id="product-detail-container" class="flex flex-row justify-center">
    <div id="product-img-container" class="w-[525px] h-[430px] mr-10">
      <img
        src="#"
        id="card-img-top"
        class="rounded-lg w-full h-full object-fill"
      />
    </div>

    <div
      id="product-main-container"
      class="ml-10 flex flex-col justify-between"
      style="width: 500px"
    >
      <div id="product-text-container" class="">
        <div id="product-name" class="text-4xl font-semibold mb-5"></div>
        <div id="product-price-label" class="flex flex-row items-end mb-5">
          <div id="product-price" class="font-bold mr-1 text-3xl"></div>
          <div id="product-price" class="text-lg">원</div>
        </div>
        <div id="category-name" class="text-gray-500 text-lg"></div>
      </div>

      <!-- 수량 변경 버튼 -->
      <div>
        <div
          id="product-amount-container"
          class="flex flex-row items-end mb-3"
        >
          <div
            id="amount-button-container"
            class="border rounded-md flex flex-row items-center justify-between"
            style="width: 150px; height: 40px"
          >
            <button
              id="button-minus"
              style="width: 50px; height: 40px"
              class="text-3xl text-center border-r rounded-l-md border-gray-200 hover:bg-gray-200"
            >
              -
            </button>
            <div id="product-amount">1</div>
            <button
              id="button-plus"
              style="width: 50px; height: 40px"
              class="text-3xl text-center border-l rounded-r-md border-gray-200 hover:bg-gray-200"
            >
              +
            </button>
          </div>
          <p class="text-gray-400 ml-3">
            ※ 재고 수량까지만 카운트 가능합니다.
          </p>
        </div>
        <div id="deliveryFee-info" class="text-gray-400">배송비 / 3000원</div>

        <!-- 총 주문 수량 & 총 상품 금액 -->
        <div
          id="total-amount-container"
          class="flex flex-row justify-between items-end mb-3"
        >
          <p>총 상품 금액</p>
          <div id="total-number-label" class="flex flex-row items-end">
            <p class="text-gray-400">총 수량&nbsp;</p>
            <p id="total-number" class="text-red-600">2</p>
            <p class="text-gray-400 mr-10">개</p>
            <p id="total-price" class="text-red-600 font-bold mr-1 text-2xl">
              28,000
            </p>
            <p id="total-price" class="text-red-600">원</p>
          </div>
        </div>

        <div
          id="button-container"
          class="flex flex-row justify-between"
          style="height: 52px"
        >
          <button
            type="button"
            style="width: 400px"
            class="shadow bg-[#69b766] hover:bg-green-700 text-white text-lg font-bold py-2 px-4 rounded focus:outline-none"
            id="order-button"
            data-bs-toggle="modal"
            data-bs-target="#modalLogin"
          >
            바로 구매
          </button>
          <button
            type="button"
            style="width: 70px"
            id="cart-button"
            class="shadow border rounded py-2 px-4 border-gray-200 hover:border-[#69b766] hover:border-2"
          >
            <span>
              <i
                id="cart-icon"
                class="fas fa-cart-shopping text-[#69b766]"
              ></i>
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <section
    id="product-info-container"
    class="mt-10 flex flex-col items-center"
  >
    <p class="text-lg mb-3" style="width: 1105px">상품 정보</p>
    <table id="product-info-table" class="mb-10" style="width: 1106px">
      <tbody>
        <tr>
          <td class="border px-4 py-2 bg-gray-200 w-44">상품 카테고리</td>
          <td id="product-category-info" class="border px-4 py-2"></td>
          <td class="border px-4 py-2 bg-gray-200 w-44">재고수량</td>
          <td id="product-amount-info" class="border px-4 py-2"></td>
        </tr>
      </tbody>
    </table>
  </section>
  `;

  let productAmount = document.getElementById('product-amount');
  let productAmountNum = parseInt(productAmount.textContent);

  const totalAmount = document.getElementById('total-number');
  const totalPrice = document.getElementById('total-price');

  let TOTALPRICE = 0;
  productAmountNum = 1;

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
      await insertCart(response, productAmountNum);
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
      await insertCart(response, productAmountNum);
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

async function insertCart(product, productAmountNum) {
  const { _id: id, shortId, productPrice, productImage, productName } = product;

  await addToDb('cart', { ...product, quantity: productAmountNum }, id);

  // productAmountNum
  await putToDb('order', 'total-order', (data) => {
    // 상품명, 상품 이미지 url, //수량, //단가, //총금액
    const totalCount = data.productsCount;
    const totalPrice = data.productsTotalPrice;
    const ids = data.ids;
    const selectedIds = data.selectedIds;
    const productLists = data.productLists || [];

    data.productsCount = totalCount
      ? totalCount + productAmountNum
      : productAmountNum;
    data.productsTotalPrice = totalPrice
      ? totalPrice + productPrice * productAmountNum
      : productPrice * productAmountNum;

    data.ids = ids ? [...ids, id] : [id];
    data.selectedIds = selectedIds ? [...selectedIds, id] : [id];

    const productData = {
      productId: id,
      quantity: productAmountNum,
      productPrice,
      productImage,
      productName,
      totalPrice: productAmountNum * productPrice,
    };
    productLists.push(productData);
    data.productLists = productLists;
  });
}
