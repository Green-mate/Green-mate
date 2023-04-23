import * as API from '../api.js';

const orderCardComponent = document.querySelector('#order-card-component');
const uid = localStorage.getItem('userId');
insertOrders();

async function insertOrders() {
  const response = await API.get('/api/orders', `${uid}`);
  const orders = await response.data;

  orders.forEach((order) => {
    const { _id, productList, shippingStatus, createdAt } = order;
    const { productName, productPrice, productImage } =
      order.productList[0].productId;
    const { quantity } = order.productList[0];

    const date = createdAt.split('T')[0];

    orderCardComponent.insertAdjacentHTML(
      'beforeend',
      `
            <div id="order-card" class="flex flex-col w-full border border-grey-100 p-8">
              <div class="border-b-2 w-full">
                <span class="float-left m-3">${date}</span>
              </div>
            
              <span class="float-left w-full py-4 text-2xl">
                ${shippingStatus}
          
              </span>
            
              <span class="font-bold">주문 내역</span>
            
              {/* <!-- 카드 1개 --> */}
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
                <span>${productPrice} ${quantity}개</span>
              </div>
            
              {/* <!-- 카드 1개 --> */}
            
              <span class="text-xl font-bold">배송비</span>
              <span class="mb-4 border-b-2 border-grey-100">3000원</span>
              <span class="text-xl font-bold">총 결제 금액</span>
              <span class="mb-4 border-b-2 border-grey-100">14,200원</span>
              <span class="text-xl font-bold">받는 사람</span>
              <span class="mb-4 border-b-2 border-grey-100">진호병</span>
              <span class="text-xl font-bold">연락처</span>
              <span class="mb-4 border-b-2 border-grey-100">01011111111</span>
              <span class="text-xl font-bold">주소</span>
              <span class="mb-4 border-b-2 border-grey-100">${address1} ${address2}</span>
              <span class="text-xl font-bold">배송 요청사항</span>
              <span class="mb-4 border-b-2 border-grey-100">
                ${shippingMessage}
              </span>
            
              <div class="flex flex-row m-10">
                <button
                  style="height: 52px; width: 200px"
                  class="shadow bg-green-500 hover:bg-green-700 text-white text-lg font-bold py-2rounded focus:outline-none mb-10 mx-auto"
                  id="submit-button "
                  type="button"
                >
                  주문정보수정
                </button>
            
                <button
                  style="height: 52px; width: 200px"
                  class="shadow bg-green-500 hover:bg-green-700 text-white text-lg font-bold py-2rounded focus:outline-none mb-10 mx-auto"
                  id="submit-button "
                  type="button"
                >
                  주문 취소
                </button>
              </div>
            </div>;
            `,
    );
  });
}
// catch(error) => {
//   console.log(error);
// };
