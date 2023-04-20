const card = document.querySelector('#card-section');

function createCard() {
  card.insertAdjacentHTML(
    'beforeend',
    `
    <div class="card-container flex items-center h-32 relative">
            <div class="checkbox-section ml-2 w-5">
              <input
                class="checkbox-one accent-[#69B766]"
                type="checkbox"
                name="check"
                value="check"
              />
            </div>
            <div id="product" class="ml-3 w-1/6">
              <a class="product-img" href="#">
                <img src="../dist/plant-1.png" width="100" height="100" />
              </a>
            </div>
            <div class="product-detail ml-6 w-1/4">
              <p
                id="product-name"
                class="text-base font-light text-zinc-600 mb-1"
              >
                식물 이름
              </p>
              <p
                id="product-price"
                class="text-base font-semibold text-zinc-700 mb-1"
              >
                10,000원
              </p>
              <p id="product-quantity" class="text-sm font-light text-zinc-500">
                수량 : 1개
              </p>
            </div>
            <div class="trash-can absolute right-5 top-3">
              <button class="delete-button" id="delete">
                <span class="icon">
                  <i class="fas fa-trash-can text-gray-200"></i>
                </span>
              </button>
            </div>
            <div class="quantity-counter absolute right-5 top-20">
              <div class="quantity flex">
                <button class="button" id="minus">
                  <span class="icon">
                    <i class="fas fa-thin fa-minus text-slate-700"></i>
                  </span>
                </button>
                <input
                  class="input text-center"
                  id="quantityInput"
                  type="number"
                  min="1"
                  max="99"
                  value="1"
                />
                <button class="button" id="plus">
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
}

for (let i = 0; i < 3; i++) {
  createCard();
}
