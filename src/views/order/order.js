import * as API from '../api.js';
import { convertToNumber, blockBeforeLogin } from '../useful-functions.js';
////////////////

blockBeforeLogin();
// 상품 카드
const goodsDetail = document.querySelector('#goods-detail-section');

function createCard() {
  goodsDetail.insertAdjacentHTML(
    'beforeend',
    `
    <div class="goods-detail-container h-[100px] mt-5 flex text-center">
        <a class="product-img ml-10 w-1/12" href="#">
          <img src="../dist/example.jpeg" width="80" height="80" />
        </a>
        <p class="product-name w-6/12 text-left ml-3 mt-2 text-sm" href="#">
          <a href="#">상품명</a>
        </p>
        <div class="product-detail flex justify-between mt-6 w-5/12">
          <p class="ml-[124px]">1</p>
          <p class="mr-20 ml-16">10,000원</p>
          <p class="mr-16">10,000원</p>
        </div>
      </div>
    `,
  );
}

for (let i = 0; i < 5; i++) {
  createCard();
}

//////////////////

// 다음 주소 API
const postalCodeInput = document.querySelector('#postal-code');
const searchAddressButton = document.querySelector('#search-address-button');
const addressMainInput = document.querySelector('#address-main');
const addressSubInput = document.querySelector('#address-sub');

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

///////////////

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

///////////////////

const nameInput = document.querySelector('#name-input');
const phoneNumberInput = document.querySelector('#phone-input');
const totalPriceContainer = document.querySelector('#total-price');

const doOrderButton = document.querySelector('#order-button');
doOrderButton.addEventListener('click', order);

// 주문 작성 (동작안합니다)
// 엘리스 솔루션 코드 참고 했습니다.
// 오히려 헷갈릴 수도 있으니 그냥 다 지우고 하시는 것도 좋을 것 같습니다.
async function order() {
  const receiverName = nameInput.value;
  const receiverPhoneNumber = phoneNumberInput.value;
  const postalCode = postalCodeInput.value;
  const address1 = addressMainInput.value;
  const address2 = addressSubInput.value;
  const requestType = requestSelectBox.value;
  const customRequest = customRequestInput.value;
  const totalPrice = convertToNumber(totalPriceContainer.innerText);
  const { selectedIds } = await getFromDb('order', 'summary');

  if (!receiverName || !receiverPhoneNumber || !postalCode || !address2) {
    return alert('배송지 정보를 모두 입력해 주세요.');
  }

  // 요청사항의 종류에 따라 request 문구가 달라짐
  let request;

  if (requestType === '0') {
    request = '요청사항 없음.';
  } else if (requestType === '6') {
    if (!customRequest) {
      return alert('요청사항을 작성해 주세요.');
    }
    request = customRequest;
  } else {
    request = requestOption[requestType];
  }

  const address = {
    postalCode,
    address1,
    address2,
    receiverName,
    receiverPhoneNumber,
  };

  try {
    // 전체 주문을 등록함
    const orderData = await API.post('/api/order', {
      totalPrice,
      address,
      request,
    });

    const orderId = orderData._id;

    // 제품별로 주문아이템을 등록함
    for (const productId of selectedIds) {
      const { quantity, price } = await getFromDb('cart', productId);
      const totalPrice = quantity * price;

      await API.post('/api/orderitem', {
        orderId,
        productId,
        quantity,
        totalPrice,
      });

      // indexedDB에서 해당 제품 관련 데이터를 제거함
      await deleteFromDb('cart', productId);
      await putToDb('order', 'summary', (data) => {
        data.ids = data.ids.filter((id) => id !== productId);
        data.selectedIds = data.selectedIds.filter((id) => id !== productId);
        data.productsCount -= 1;
        data.productsTotal -= totalPrice;
      });
    }

    // 입력된 배송지정보를 유저db에 등록함
    const data = {
      phoneNumber: receiverPhoneNumber,
      address: {
        postalCode,
        address1,
        address2,
      },
    };
    await API.post('/api/user/deliveryinfo', data);

    alert('결제 및 주문이 정상적으로 완료되었습니다.\n감사합니다.');
    window.location.href = '/order/complete';
  } catch (err) {
    console.log(err);
    alert(`결제 중 문제가 발생하였습니다: ${err.message}`);
  }
}
