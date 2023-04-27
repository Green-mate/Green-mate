import * as API from '../api.js';
import { getUrlParams, blockBeforeLogin } from '/useful-functions.js';
import { renderCategoryBar } from '../common/mypage-sidebar.js';

let postalCodeInput = document.getElementById('postal-code');
let addressMainInput = document.getElementById('address1-input');
let addressSubInput = document.getElementById('address2-input');

let recipientNameInput = document.getElementById('recipient-name');
let phoneNumberInput = document.getElementById('phone-number');
let shippingMsgInput = document.getElementById('shipping-msg');

const searchAddressBtn = document.getElementById('search-address-button');
const submitEditBtn = document.getElementById('submit-order-edit-btn');

const oid = Object.keys(getUrlParams())[0];
//{644688947e15586acaf3a688: ''} -> 644688947e15586acaf3a688
console.log(oid);

blockBeforeLogin();
renderCategoryBar();

// address
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

searchAddressBtn.addEventListener('click', searchAddress);

// /api/orders/:oid
// {
//   "recipient" : "엘리스",
//   "phoneNumber" : "01012341234",
//   "zipCode" : "12345",
//   "address1" : "서울시 성수성수 ",
//   "address2" : "성수낙낙 너무 조아",
//   "shippingMessage" : "매니저님께 맡겨주세요."
//   }
async function handleEditOrderInfo(e) {
  e.preventDefault();
  const recipient = recipientNameInput.value;
  const phoneNumber = phoneNumberInput.value;
  const zipCode = postalCodeInput.value;
  const address1 = addressMainInput.value;
  const address2 = addressSubInput.value;
  const shippingMessage = shippingMsgInput.value;

  try {
    const data = {
      recipient,
      phoneNumber,
      zipCode,
      address1,
      address2,
      shippingMessage,
    };
    await API.patch('/api/orders', `${oid}`, data);
    alert('주문 정보가 수정되었습니다!');
    window.location.href = '/mypage-shipping';
  } catch (err) {
    alert(err.message);
  }
}

submitEditBtn.addEventListener('click', handleEditOrderInfo);
