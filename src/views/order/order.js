import * as API from '../api.js';
import { convertToNumber, blockBeforeLogin } from '../useful-functions.js';
import { getFromDb, deleteFromDb, putToDb } from '../indexed-DB.js';
blockBeforeLogin();
// 상품 카드
const goodsDetail = document.querySelector('#goods-detail-section');
const productTotalPrice = document.querySelector('#product-total-price');
// 배송비 합친 금액
const totalPriceContainer = document.querySelector('#total-price');

// getFromDb로 데이터 받아옴
const { productLists, productsCount, productsTotalPrice, selectedIds } =
  await getFromDb('order', 'total-order');

// 같이 넘길 userId임
const userId = localStorage.getItem('userId');

// 배송 요청 사항 option message
const requestOption = {
  1: '직접 수령하겠습니다.',
  2: '배송 전 연락바랍니다.',
  3: '부재 시 경비실에 맡겨주세요.',
  4: '부재 시 문 앞에 놓아주세요.',
  5: '부재 시 택배함에 넣어주세요.',
  6: '직접 입력',
};

// 화면 렌더링 작업
productTotalPrice.innerText = productsTotalPrice;
totalPriceContainer.innerText = productsTotalPrice + 3000;

for (const product of productLists) {
  createCard(product);
}
function createCard(product) {
  goodsDetail.insertAdjacentHTML(
    'beforeend',
    `
    <div class="goods-detail-container h-[100px] mt-5 flex text-center">
        <div class="product-img ml-10 w-[80px] h-[80px]">
          <img class="w-full h-full object-fill rounded-md" src="${product.productImage}" width="80" height="80" />
        </div>
        <p class="product-name w-6/12 text-left ml-3 mt-2 text-sm">
          <a>${product.productName}</a>
        </p>
        <div class="product-detail flex justify-between mt-6 w-5/12">
          <p class="ml-[124px]">${product.quantity}</p>
          <p class="mr-20 ml-16">${product.productPrice}원</p>
          <p class="mr-16">${product.totalPrice}원</p>
        </div>
      </div>
    `,
  );
}

// 다음 주소 API
const postalCodeInput = document.querySelector('#postal-code');
const searchAddressButton = document.querySelector('#search-address-button');
const addressMainInput = document.querySelector('#address-main');
const addressSubInput = document.querySelector('#address-sub');

/* 다음 주소 API */
function searchAddress(e) {
  e.preventDefault(e);

  new daum.Postcode({
    oncomplete: function (data) {
      let addr = '';
      let extraAddr = '';

      if (data.userSelectedType === 'R') {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }

      if (data.userSelectedType === 'R') {
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr +=
            extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
        }
        if (extraAddr !== '') {
          extraAddr = ' (' + extraAddr + ')';
        }
      } else {
      }

      postalCodeInput.value = data.zonecode;
      addressMainInput.value = `${addr} ${extraAddr}`;
      addressSubInput.placeholder = '상세 주소를 입력해 주세요.';
      addressSubInput.focus();
    },
  }).open();
}

searchAddressButton.addEventListener('click', searchAddress);

const requestSelectBox = document.querySelector('#request-select-box');
const customRequestContainer = document.querySelector(
  '#custom-request-container',
);
const customRequestInput = document.querySelector('#custom-request-input');

// "직접 입력" 선택 시 input칸 보이게 함
// default값(배송 시 요청사항을 선택해 주세여) 이외를 선택 시 글자가 진해지도록 함
function handleRequestChange(e) {
  const type = e.target.value;

  if (type === '6') {
    customRequestContainer.style.display = 'flex';
    customRequestInput.focus();
  } else {
    customRequestContainer.style.display = 'none';
  }

  if (type === '0') {
    requestSelectBox.style.color = 'rgba(0, 0, 0, 0.3)';
  } else {
    requestSelectBox.style.color = 'rgba(0, 0, 0, 1)';
  }
}

requestSelectBox.addEventListener('change', handleRequestChange);

// 주문 API보내기

const nameInput = document.querySelector('#name-input');
const phoneNumberInput = document.querySelector('#phone-input');
const doOrderButton = document.querySelector('#order-button');
doOrderButton.addEventListener('click', order);

async function order() {
  const receiverName = nameInput.value;
  const receiverPhoneNumber = phoneNumberInput.value;
  const postalCode = postalCodeInput.value;
  const address1 = addressMainInput.value;
  const address2 = addressSubInput.value;
  const requestType = requestSelectBox.value;
  const customRequest = customRequestInput.value;
  const totalPrice = productsTotalPrice + 3000;
  const productList = [];
  if (!receiverName || !receiverPhoneNumber || !postalCode || !address2) {
    return alert('배송지 정보를 모두 입력해 주세요.');
  }

  // 요청사항의 종류에 따라 request 문구가 달라짐
  let shippingMessage;

  if (requestType === '0') {
    shippingMessage = '요청사항 없음.';
  } else if (requestType === '6') {
    if (!customRequest) {
      return alert('요청사항을 작성해 주세요.');
    }
    shippingMessage = customRequest;
  } else {
    shippingMessage = requestOption[requestType];
  }

  for (const product of productLists) {
    const { productId, quantity } = product;
    const productData = {
      productId,
      quantity,
    };
    productList.push(productData);
  }

  try {
    // 전체 주문을 등록함
    // - userId
    // - productList (상품 리스트)
    // - recipient (받는이)
    // - phoneNumber
    // - zipCode (배송 우편번호)
    // - address1 (배송지 주소)
    // - address2 (배송지 상세주소)
    // - shippingMessage (배송요청 메시지)

    const data = {
      recipient: receiverName,
      userId,
      phoneNumber: receiverPhoneNumber,
      productList,
      zipCode: postalCode,
      address1,
      address2,
      shippingMessage,
    };
    await API.post('/api/new-order', data);

    // indexedDB에서 해당 제품 관련 데이터를 제거함 -> 주문이 완료 되었으므로
    for (const productId of selectedIds) {
      const totalPrice = await deleteFromDb('cart', productId);
      await putToDb('order', 'total-order', (data) => {
        data.ids = data.ids.filter((id) => id !== productId);
        data.selectedIds = data.selectedIds.filter((id) => id !== productId);
        data.productsCount = 0;
        data.productsTotalPrice = 0;
        data.productLists = data.productLists.filter(
          (product) => product.productId !== productId,
        );
      });
    }

    alert('결제 및 주문이 정상적으로 완료되었습니다.\n감사합니다.');
    window.location.href = '/order-complete';
  } catch (err) {
    console.log(err);
    alert(`결제 중 문제가 발생하였습니다: ${err.message}`);
  }
}
