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