import * as API from '../api.js';

const orderCardComponent = document.querySelector('#order-card-component');
const uid = localStorage.getItem('userId');
const DELIVERY_CHARGE = 3000;
let TOTALPRICE = DELIVERY_CHARGE;
const editOrderInfo = {};

getOrdersLists();

async function getOrdersLists() {
  const orders = await API.get('/api/orders', `${uid}`);
  console.log('orders : ', orders);

  if (orders.length === 0) {
    orderCardComponent.innerHTML += `
    <div class="flex justify-center items-center pt-28 text-2xl font-bold text-gray-500">주문 내역이 없습니다.</div>
    `;
  }

  for (const order of orders) {
    const newOrderCard = createOrderCard(order);
    orderCardComponent.insertAdjacentHTML('beforeend', newOrderCard);
  }
}

// 주문 수정 시 보낼 내용
// {
//   "recipient" : "엘리스",
//   "phoneNumber" : "01012341234",
//   "zipCode" : "12345",
//   "address1" : "서울시 성수성수 ",
//   "address2" : "성수낙낙 너무 조아",
//   "shippingMessage" : "매니저님께 맡겨주세요."
//   }

function createOrderCard(order) {
  const {
    _id,
    productList,
    shippingStatus,
    createdAt,
    recipient,
    shippingMessage,
    address1,
    address2,
    phoneNumber,
    zipCode,
  } = order;

  const date = createdAt.split('T')[0];
  console.log(productList);

  let productCardsHTML = ``; // 빈 문자열로 초기화
  TOTALPRICE = DELIVERY_CHARGE;
  for (const product of productList) {
    const newProductCard = createProductCard(product);
    // productCardsHTML.insertAdjacentHTML('beforeend', newProductCard);
    productCardsHTML += newProductCard; // 각 상품 리스트 HTML 코드를 추가
  }

  return `
  <div id="order-card" class="flex flex-col w-full border border-grey-100 p-8 mb-14">
    <div class="border-b-2 w-full">
      <span class="float-left mt-3 mb-3">주문일&nbsp&nbsp&nbsp&nbsp${date}</span>
    </div>

    <span class="float-left w-full py-4 text-3xl text-[#69b766] mt-3 mb-3 font-semibold">
      ${shippingStatus}
    </span>

    <span class="text-xl font-bold mb-5">주문 내역</span>

    <div id="one-product-card-wrap">${productCardsHTML}</div>

    <span class="text-xl font-bold mt-5 mb-3">배송비</span>
    <span class="mb-4 border-b-2 border-grey-100">${DELIVERY_CHARGE}</span>
    <span class="text-xl font-bold mb-3">총 결제 금액</span>
    <span class="mb-4 border-b-2 border-grey-100">${TOTALPRICE}</span>
    <span class="text-xl font-bold mb-3">받는 사람</span>
    <input id="recipient-name" class="rounded mb-4 border-2 border-grey-100" value="${recipient}"></input>
    <span class="text-xl font-bold mb-3">연락처</span>
    <input id="phone-number" class="rounded mb-4 border-2 border-grey-100" value="${phoneNumber}"></input>
    <div class="flex flex-row mb-3 items-center">
       <span class="text-xl font-bold">주소</span>
       <button
        class="search-address border rounded w-20 ml-3 bg-[#f6f6f6]"
        id="search-address-button"
      > 주소 재검색
      </button>
    </div>

    <input id="postal-code" class="rounded border-2 border-grey-100" value="${zipCode}"></input>
    <input id="address1-input" class="rounded border-2 border-grey-100" value="${address1}"></input>
    <input id="address2-input" class="rounded mb-4 border-2 border-grey-100" value="${address2}"></input>
    <span class="text-xl font-bold mb-3">배송 요청사항</span>
    <input id="shipping-msg" class="rounded mb-4 border-2 border-grey-100" value="${shippingMessage}"></input>

    <div class="flex flex-row m-10">
      <button
        style="height: 52px; width: 200px"
        class="shadow bg-[#69b766] hover:bg-green-700 text-white text-lg font-bold py-2 rounded focus:outline-none mb-5 mx-auto"
        id="edit-order-info-submit-btn"
        type="button"
      >
        주문정보수정
      </button>

      <button
        style="height: 52px; width: 200px"
        class="shadow bg-[#69b766] hover:bg-green-700 text-white text-lg font-bold py-2 rounded focus:outline-none mb-5 mx-auto"
        id="delete-order-btn"
        type="button"
      >
        주문 취소
      </button>
    </div>

  </div>
  `;
}

/***************************주문 수정작업과 삭제 작업을 하기 위해서 주문 정보가 입력된 dom요소를 가져와야 하는데 가져와지지가 않음**************************/

document.addEventListener('DOMContentLoaded', () => {
  let postalCodeInput = document.getElementById('postal-code');
  let addressMainInput = document.getElementById('address1-input');
  let addressSubInput = document.getElementById('address2-input');
  let recipientNameInput = document.getElementById('recipient-name');
  let phoneNumberInput = document.getElementById('phone-number');
  let shippingMsgInput = document.getElementById('shipping-msg');

  let postalCodeVal = postalCodeInput.value;
  console.log(postalCodeVal);
  const EditOrderSubmitBtn = document.querySelector(
    '#edit-order-info-submit-btn',
  );
  const deleteOrderBtn = document.querySelector('#delete-order-btn');
});

window.onload = function () {
  let postalCodeInput = document.getElementById('postal-code');
  let addressMainInput = document.getElementById('address1-input');
  let addressSubInput = document.getElementById('address2-input');
  let recipientNameInput = document.getElementById('recipient-name');
  let phoneNumberInput = document.getElementById('phone-number');
  let shippingMsgInput = document.getElementById('shipping-msg');

  let postalCodeVal = postalCodeInput.value;
  console.log(postalCodeVal);
  const EditOrderSubmitBtn = document.querySelector(
    '#edit-order-info-submit-btn',
  );
  const deleteOrderBtn = document.querySelector('#delete-order-btn');
};

/***********************************************************************************************************************************/

function createProductCard(product) {
  const { productId, quantity } = product;
  const { productName, productImage, productPrice } = productId;

  TOTALPRICE += productPrice * quantity;

  return `
  <div class="w-11/12 my-2 p-3 border rounded flex flex-row justify-between items-end mx-auto">
    <div class="flex flex-row items-center">
      <img
        src="${productImage}"
        style="width: 100px; height: 100px"
        class="rounded mr-10"
        alt="product-image"
      />
      <span>${productName}</span>
    </div>
    <span>${productPrice}원 X ${quantity}개</span>
  </div>
  `;
}
