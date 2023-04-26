import {
  getFromDb,
  putToDb,
  deleteFromDb,
  openDatabase,
} from '../indexed-DB.js';

const cardDeleteBtn = document.getElementsByClassName('delete-cart-btn');

const selectedCountDiv = document.getElementById('selected-count');
const wholeGoodsPriceDiv = document.getElementById('whole-goods-price');
const totalPriceDiv = document.getElementById('total-price');
const cartContentDiv = document.getElementById('cart-content-div');
const allDeleteBtn = document.getElementById('all-delete-btn');
const orderButton = document.getElementById('order-button');
const cartList = await getFromDb('cart');

console.log(cartList);

let cartCount = 0;
let cartsPrice = 0;

for (var cart of cartList) {
  cartCount += cart.quantity;
  cartsPrice += cart.productPrice * cart.quantity;
  cartContentDiv.insertAdjacentHTML(
    'beforeBegin',
    `
    <div class="flex bg-white shadow-md rounded-md overflow-hidden m-10">
    <img
      class="w-1/4"
      src=${cart.productImage}
      alt="card image"
    />
    <div class="w-3/4 p-4">
      <span class="block font-bold text-gray-800 text-lg mb-2"
        >${cart.productName}</span
      >
      <span class="block  text-lg font-bold mb-2"
        >${cart.productPrice * cart.quantity}원</span
      >
      <span class="block text-gray-600 text-sm mb-2">수량 : ${
        cart.quantity
      }개</span>
      <button
        class="delete-cart-btn bg-[#69b766] hover:bg-[#8ed08c] text-white font-bold py-2 px-4 rounded"
        name="${cart._id}"
      >
        삭제
      </button>
    </div>
  </div>
    `,
  );
}

selectedCountDiv.innerText = cartCount + '개';
wholeGoodsPriceDiv.innerText = cartsPrice + '원';
totalPriceDiv.innerText = cartsPrice + 3000 + '원';

//삭제 버튼
for (let btn of cardDeleteBtn) {
  let cartID = btn.name;

  btn.addEventListener('click', async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteFromDb('cart', cartID);
      await putToDb('order', 'total-order', (data) => {
        const leftProducts = data.productLists.filter(
          (product) => product.productId !== cartID,
        );

        data.ids = data.ids.filter((id) => id !== cartID);
        data.productLists = data.productLists.filter(
          (product) => product.productId !== cartID,
        );
        data.productsCount = leftProducts.reduce(
          (acc, cur) => acc + cur.quantity,
          0,
        );
        data.productsTotalPrice = leftProducts.reduce(
          (acc, cur) => acc + cur.totalPrice,
          0,
        );
        data.selectedIds = data.selectedIds.filter((id) => id !== cartID);
        return data;
      }).then(() => {
        window.location.reload();
      });
    }
  });
}

allDeleteBtn.addEventListener('click', async () => {
  let database = await openDatabase();
  const cartTransaction = database.transaction(['cart'], 'readwrite');
  const orderTransaction = database.transaction(['order'], 'readwrite');
  const cartStore = cartTransaction.objectStore('cart');
  const orderStore = orderTransaction.objectStore('order');
  if (window.confirm('정말 전체 삭제하시겠습니까?')) {
    await cartStore.clear();
    await orderStore.clear();
    window.location.reload();
    alert('장바구니가 비었습니다. \n식물 친구들을 담아주세요🪴');
  }
});

orderButton.addEventListener('click', async () => {
  window.location.href = '/order';
});
