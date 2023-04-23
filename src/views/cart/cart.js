import { navigate } from '../useful-functions.js';
import { deleteFromDb, getFromDb, putToDb } from '../indexed-DB.js';

// const orderContainer = document.querySelector('#order-container');

const card = document.querySelector('#card-section');

async function insertProductsfromDb() {
  const products = await getFromDb('cart');
  const { selectedIds } = await getFromDb('order', 'summary');

  products.forEach(async (product) => {
    // 객체 destructuring
    const { _id, title, quantity, imageKey, price } = product;
    const imageUrl = await getImageUrl(imageKey);

    const isSelected = selectedIds.includes(_id);

    card.insertAdjacentHTML(
      'beforeend',
      `
      <div class="card-container flex items-center h-32 relative" id="product-${_id}" >
      <div class="checkbox-section ml-2 w-5">
        <input
          class="checkbox-one accent-[#69B766]"
          id="checkbox-one-${_id}"
          type="checkbox"
          name="check"
          value="check"
          ${isSelected ? 'checked' : ''}
        />
      </div>
      <div id="product" class="ml-3 w-1/6">
        <a class="product-img" href="#">
          <img src="${imageUrl}" id="image-${_id}" width="100" height="100" />
        </a>
      </div>
      <div class="product-detail ml-6 w-1/4">
        <p
          id="product-${id}"
          class="text-base font-light text-zinc-600 mb-1"
        >
          ${title}
        </p>
        <p
          id="product-price-${id}"
          class="text-base font-semibold text-zinc-700 mb-1"
        >
          ${addCommas(price)}원
        </p>
        <p id="product-quantity-${id}" class="text-sm font-light text-zinc-500">
          수량 : ${quantity}개
        </p>
      </div>
      <div class="trash-can absolute right-5 top-3">
        <button class="delete-button" id="delete-${_id}">
          <span class="icon">
            <i class="fas fa-trash-can text-gray-200"></i>
          </span>
        </button>
      </div>
      <div class="quantity-counter absolute right-5 top-20">
        <div class="quantity flex">
          <button class="button" id="minus-${_id}" ${
        quantity <= 1 ? 'disabled' : ''
      }>
            <span class="icon">
              <i class="fas fa-thin fa-minus text-slate-700"></i>
            </span>
          </button>
          <input
            class="input text-center w-[30px] mx-3 border rounded border-[#f6f6f6]"
            id="quantity-input-${_id}"
            type="text"
            min="1"
            max="99"
            value="${quantity}"
          />
          <button class="button" id="plus-${_id}" ${
        quantity >= 99 ? 'disabled' : ''
      }>
            <span class="icon">
              <i class="fas fa-lg fa-plus text-slate-700"></i>
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="border-line">
      <hr class="border-t border-gray-500 opacity-25" />
    </div>
      `,
    );
    document
      .querySelector(`#image-${_id}`)
      .addEventListener('click', navigate(`/product/detail?id=${_id}`));

    document
      .querySelector(`product-${id}`)
      .addEventListener('click', navigate(`/product/detail?id=${_id}`));

    document
      .querySelector(`#plus-${_id}`)
      .addEventListener('click', () => increaseItemQuantity(_id));

    document
      .querySelector(`#minus-${_id}`)
      .addEventListener('click', () => decreaseItemQuantity(_id));

    document
      .querySelector(`#quantity-input-${_id}`)
      .addEventListener('change', () => handleQuantityInput(_id));

    document
      .querySelector(`#checkbox-one-${_id}`)
      .addEventListener('change', () => toggleItem(_id));

    document
      .querySelector(`#delete-${_id}`)
      .addEventListener('click', () => deleteItem(_id));
  });
}

async function increaseItemQuantity(id) {
  // 결제정보카드 업데이트
  await updateOrderSummary(id, 'add-plusButton');

  // 제품아이템카드 업데이트
  await updateProductItem(id, 'increase');

  // indexedDB의 cart 데이터 업데이트
  await putToDb('cart', id, (data) => {
    data.quantity = data.quantity + 1;
  });

  // 수량 변경박스(-버튼, 입력칸, +버튼) 상태 업데이트
  setQuantityBox(id, 'plus');
}

async function decreaseItemQuantity(id) {
  // 결제정보카드 업데이트
  await updateOrderSummary(id, 'minusButton');

  // 제품아이템카드 업데이트
  await updateProductItem(id, 'decrease');

  // indexedDB의 cart 데이터 업데이트
  await putToDb('cart', id, (data) => {
    data.quantity = data.quantity - 1;
  });

  // 수량 변경박스(-버튼, 입력칸, +버튼) 상태 업데이트
  setQuantityBox(id, 'minus');
}

async function handleQuantityInput(id) {
  // 우선 입력값이 범위 1~99 인지 확인
  const productQuantityElem = document.querySelector(`#product-quantity-${id}`);
  const quantity = parseInt(productQuantityElem.value);

  if (quantity < 1 || quantity > 99) {
    return alert('수량은 1~99 사이가 가능합니다.');
  }

  // 결제정보카드 업데이트
  await updateOrderSummary(id, 'add-input');

  // 제품아이템카드 업데이트
  await updateProductItem(id, 'input');

  // indexedDB의 cart 데이터 업데이트
  await putToDb('cart', id, (data) => {
    data.quantity = quantity;
  });

  // 수량 변경박스(-버튼, 입력칸, +버튼) 상태 업데이트
  setQuantityBox(id, 'input');
}

async function toggleItem(id) {
  const itemCheckbox = document.querySelector(`#checkbox-one-${_id}`);
  const isChecked = itemCheckbox.checked;

  // 결제정보 업데이트 및, 체크 상태에서는 수량을 수정 가능 (언체크는 불가능)으로 함
  if (isChecked) {
    await updateOrderSummary(id, 'add-checkbox');
    setQuantityBox(id, 'able');
  } else {
    await updateOrderSummary(id, 'removeTemp-checkbox');
    setQuantityBox(id, 'disable');
  }
}

async function deleteItem(id) {
  // indexedDB의 cart 목록에서 id를 key로 가지는 데이터를 삭제함.
  await deleteFromDb('cart', id);

  // 결제정보를 업데이트함.
  await updateOrderSummary(id, 'removePermanent-deleteButton');

  // 제품 요소(컴포넌트)를 페이지에서 제거함
  document.querySelector(`#product-${_id}`).remove();

  // 전체선택 체크박스를 업데이트함
  updateAllSelectCheckbox();
}

// 전체선택 체크박스를, 현재 상황에 맞추어
// 체크 또는 언체크 상태로 만듦
async function updateAllSelectCheckbox() {
  const { ids, selectedIds } = await getFromDb('order', 'summary');

  const isOrderEmpty = ids.length === 0;
  const isAllItemSelected = ids.length === selectedIds.length;

  // 장바구니 아이템(제품) 수가 0이 아니고,
  // 또 전체 아이템들이 선택된 상태라면 체크함.
  if (!isOrderEmpty && isAllItemSelected) {
    checkBoxAll.checked = true;
  } else {
    checkBoxAll.checked = false;
  }
}

async function deleteSelectedItems() {
  const { selectedIds } = await getFromDb('order', 'summary');

  selectedIds.forEach((id) => deleteItem(id));
}

async function toggleAll(e) {
  // 전체 체크냐 전체 체크 해제이냐로 true 혹은 false
  const isCheckAll = e.target.checked;
  const { ids } = await getFromDb('order', 'summary');

  ids.forEach(async (id) => {
    const itemCheckbox = document.querySelector(`#checkbox-one-${_id}`);
    const isItemCurrentlyChecked = itemCheckbox.checked;

    // 일단 아이템(제품) 체크박스에 전체 체크 혹은 언체크 여부를 반영함.
    itemCheckbox.checked = isCheckAll;

    // 결제정보 업데이트 필요 여부 확인
    const isAddRequired = isCheckAll && !isItemCurrentlyChecked;
    const isRemoveRequired = !isCheckAll && isItemCurrentlyChecked;

    // 결제정보 업데이트 및, 체크 상태에서는 수정 가능으로 함
    if (isAddRequired) {
      updateOrderSummary(id, 'add-checkbox');
      setQuantityBox(id, 'able');
    }

    // 결제정보 업데이트 및, 언체크 상태에서는 수정 불가능으로 함
    if (isRemoveRequired) {
      updateOrderSummary(id, 'removeTemp-checkbox');
      setQuantityBox(id, 'disable');
    }
  });
}

// -버튼, 숫자입력칸, +버튼 활성화 여부 및 값을 세팅함.
function setQuantityBox(id, type) {
  // 세팅 방식 결정을 위한 변수들
  const isPlus = type.includes('plus');
  const isMinus = type.includes('minus');
  const isInput = type.includes('input');
  const isDisableAll = type.includes('disable');

  // 세팅을 위한 요소들
  const minusButton = document.querySelector(`#minus-${id}`);
  const quantityInput = document.querySelector(`#product-quantity-${id}`);
  const plusButton = document.querySelector(`#plus-${id}`);

  // 우선 기본적으로 활성화시킴
  minusButton.removeAttribute('disabled');
  quantityInput.removeAttribute('disabled');
  plusButton.removeAttribute('disabled');

  // 전체 비활성화 시키는 타입일 경우 (제품 체크를 해제했을 때 등)
  if (isDisableAll) {
    minusButton.setAttribute('disabled', '');
    quantityInput.setAttribute('disabled', '');
    plusButton.setAttribute('disabled', '');
    return;
  }

  // input칸 값을 업데이트하기 위한 변수 설정
  let quantityUpdate;
  if (isPlus) {
    quantityUpdate = +1;
  } else if (isMinus) {
    quantityUpdate = -1;
  } else if (isInput) {
    quantityUpdate = 0;
  } else {
    quantityUpdate = 0;
  }

  // input칸 값 업데이트
  const currentQuantity = parseInt(quantityInput.value);
  const newQuantity = currentQuantity + quantityUpdate;
  quantityInput.value = newQuantity;

  // 숫자는 1~99만 가능
  const isMin = newQuantity === 1;
  const isMax = newQuantity === 99;

  if (isMin) {
    minusButton.setAttribute('disabled', '');
  }

  if (isMax) {
    plusButton.setAttribute('disabled', '');
  }
}

// 요소(element), input 혹은 상수

const checkBoxAll = document.querySelector('#checkbox-all');
const checkedDelete = document.querySelector('#checked-delete');
const selectedCountElem = document.querySelector('#selected-count');
const wholeGoodsPriceElem = document.querySelector('#whole-goods-price');
const deliveryFeeElem = document.querySelector('#delivery-fee');
const totalPriceElem = document.querySelector('#total-price');
const orderButton = document.querySelector('#order-button');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllElements() {
  insertProductsfromDb();
  insertOrderSummary();
  updateAllSelectCheckbox();
}

// addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  checkBoxAll.addEventListener('change', toggleAll);
  checkedDelete.addEventListener('click', deleteSelectedItems);
  orderButton.addEventListener('click', navigate('/order'));
}

// 결제정보 카드 업데이트 및, indexedDB 업데이트를 진행함.
async function updateOrderSummary(id, type) {
  // 업데이트 방식 결정을 위한 변수들
  const isCheckbox = type.includes('checkbox');
  const isInput = type.includes('input');
  const isDeleteButton = type.includes('deleteButton');
  const isMinusButton = type.includes('minusButton');
  const isPlusButton = type.includes('plusButton');
  const isAdd = type.includes('add');
  const isRemoveTemp = type.includes('removeTemp');
  const isRemovePermanent = type.includes('removePermanent');
  const isRemove = isRemoveTemp || isRemovePermanent;
  const isItemChecked = document.querySelector(`#checkbox-one-${_id}`).checked;
  const isDeleteWithoutChecked = isDeleteButton && !isItemChecked;

  // 업데이트에 사용될 변수
  let price;
  let quantity;

  // 체크박스 혹은 삭제 버튼 클릭으로 인한 업데이트임.
  if (isCheckbox || isDeleteButton) {
    const priceElem = document.querySelector(`#total-${id}`);
    price = convertToNumber(priceElem.innerText);

    quantity = 1;
  }

  // - + 버튼 클릭으로 인한 업데이트임.
  if (isMinusButton || isPlusButton) {
    const productPriceElem = document.querySelector(`#product-price-${id}`);
    price = convertToNumber(productPriceElem.innerText);

    quantity = 0;
  }

  // input 박스 입력으로 인한 업데이트임
  if (isInput) {
    const productPriceElem = document.querySelector(`#product-price-${id}`);
    const productPrice = convertToNumber(productPriceElem.innerText);

    const inputElem = document.querySelector(`#quantityInput-${id}`);
    const inputQuantity = convertToNumber(inputElem.value);

    const quantityElem = document.querySelector(`#quantity-${id}`);
    const currentQuantity = convertToNumber(quantityElem.innerText);

    price = productPrice * (inputQuantity - currentQuantity);

    quantity = 0;
  }

  // 업데이트 방식
  const priceUpdate = isAdd ? +price : -price;
  const countUpdate = isAdd ? +quantity : -quantity;

  // 현재 결제정보의 값들을 가져오고 숫자로 바꿈.
  const currentCount = convertToNumber(selectedCountElem.innerText);
  const currentWholeGoodsPrice = convertToNumber(wholeGoodsPriceElem.innerText);
  const currentFee = convertToNumber(deliveryFeeElem.innerText);
  const currentOrderTotal = convertToNumber(totalPriceElem.innerText);

  // 결제정보 관련 요소들 업데이트
  if (!isDeleteWithoutChecked) {
    selectedCountElem.innerText = `${currentCount + countUpdate}개`;
    wholeGoodsPriceElem.innerText = `${addCommas(
      currentWholeGoodsPrice + priceUpdate,
    )}원`;
  }

  // 기존 결제정보가 비어있었어서, 배송비 또한 0인 상태였던 경우
  const isFeeAddRequired = isAdd && currentFee === 0;

  if (isFeeAddRequired) {
    deliveryFeeElem.innerText = `3000원`;
    totalPriceElem.innerText = `${addCommas(
      currentOrderTotal + priceUpdate + 3000,
    )}원`;
  }

  if (!isFeeAddRequired && !isDeleteWithoutChecked) {
    totalPriceElem.innerText = `${addCommas(
      currentOrderTotal + priceUpdate,
    )}원`;
  }

  // 이 업데이트로 인해 결제정보가 비게 되는 경우
  const isCartNowEmpty = currentCount === 1 && isRemove;

  if (!isDeleteWithoutChecked && isCartNowEmpty) {
    deliveryFeeElem.innerText = `0원`;

    // 다시 한 번, 현재 값을 가져와서 3000을 빼 줌
    const currentOrderTotal = convertToNumber(totalPriceElem.innerText);
    totalPriceElem.innerText = `${addCommas(currentOrderTotal - 3000)}원`;

    // 전체선택도 언체크되도록 함.
    updateAllSelectCheckbox();
  }

  // indexedDB의 order.summary 업데이트
  await putToDb('order', 'summary', (data) => {
    const hasId = data.selectedIds.includes(id);

    if (isAdd && !hasId) {
      data.selectedIds.push(id);
    }

    if (isRemoveTemp) {
      data.selectedIds = data.selectedIds.filter((_id) => _id !== id);
    }

    if (isRemovePermanent) {
      data.ids = data.ids.filter((_id) => _id !== id);
      data.selectedIds = data.selectedIds.filter((_id) => _id !== id);
    }

    if (!isDeleteWithoutChecked) {
      data.productsCount += countUpdate;
      data.productsTotal += priceUpdate;
    }
  });

  // 전체선택 체크박스 업데이트
  updateAllSelectCheckbox();
}

// 아이템(제품)카드의 수량, 금액 등을 업데이트함
async function updateProductItem(id, type) {
  // 업데이트 방식을 결정하는 변수들
  const isInput = type.includes('input');
  const isIncrease = type.includes('increase');

  // 업데이트에 필요한 요소 및 값들을 가져오고 숫자로 바꿈.
  const productPriceElem = document.querySelector(`#product-price-${id}`);
  const productPrice = convertToNumber(productPriceElem.innerText);

  const quantityElem = document.querySelector(`#quantity-${id}`);
  const currentQuantity = convertToNumber(quantityElem.innerText);

  const totalElem = document.querySelector(`#total-${id}`);
  const currentTotal = convertToNumber(totalElem.innerText);

  const inputElem = document.querySelector(`#quantityInput-${id}`);
  const inputQuantity = convertToNumber(inputElem.value);

  // 업데이트 진행
  if (isInput) {
    quantityElem.innerText = `${inputQuantity}개`;
    totalElem.innerText = `${addCommas(productPrice * inputQuantity)}원`;
    return;
  }

  const quantityUpdate = isIncrease ? +1 : -1;
  const priceUpdate = isIncrease ? +productPrice : -productPrice;

  quantityElem.innerText = `${currentQuantity + quantityUpdate}개`;
  totalElem.innerText = `${addCommas(currentTotal + priceUpdate)}원`;
}

// 페이지 로드 시 실행되며, 결제정보 카드에 값을 삽입함.
async function insertOrderSummary() {
  const { productsCount, productsTotal } = await getFromDb('order', 'summary');

  const hasItems = productsCount !== 0;

  productsCountElem.innerText = `${productsCount}개`;
  productsTotalElem.innerText = `${addCommas(productsTotal)}원`;

  if (hasItems) {
    deliveryFeeElem.innerText = `3,000원`;
    totalPriceElem.innerText = `${addCommas(productsTotal + 3000)}원`;
  } else {
    deliveryFeeElem.innerText = `0원`;
    totalPriceElem.innerText = `0원`;
  }
}
