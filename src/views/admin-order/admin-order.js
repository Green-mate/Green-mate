import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.6/+esm';

const nextPageBtn = document.getElementById('next_page_btn');
const previousPageBtn = document.getElementById('previous_page_btn');

const currentUrl = new URL(window.location.href);

const orderListDiv = document.getElementById('order-list-div');
const orderUpdateBtn = document.getElementsByClassName('order-update-btn');
const orderDeleteBtn = document.getElementsByClassName('order-delete-btn');

// 정의 파트

let orderList = [];

const adminGetOrderAPI = async () => {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page');

  const config = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQwYTUxNDNlZjRjZjlkNGEyMDE4ZjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODIxNDAxMjV9.pfKeseBdzQafcW9-Dl_XBHWRmYQheQTzh1TzXpNA_XY`,
    },
  };
  try {
    await axios
      .get(`/api/admin/orders?currentPage=${page}`, config)
      .then((response) => {
        orderList = response.data;
      });
  } catch (error) {
    console.error(error);
  }
};

const adminPutOrderAPI = async (data, id) => {
  const config = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQwYTUxNDNlZjRjZjlkNGEyMDE4ZjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODIxNDAxMjV9.pfKeseBdzQafcW9-Dl_XBHWRmYQheQTzh1TzXpNA_XY`,
    },
  };

  try {
    await axios
      .patch(`/api/admin/orders/${id}`, data, config)
      .then((response) => {
        window.location.reload();
      });
  } catch (error) {
    console.error(error);
  }
};

const adminDeleteOrderAPI = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQwYTUxNDNlZjRjZjlkNGEyMDE4ZjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODIxNDAxMjV9.pfKeseBdzQafcW9-Dl_XBHWRmYQheQTzh1TzXpNA_XY`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  };

  try {
    await axios.delete(`/api/admin/orders/${id}`, config).then((res) => {
      window.location.reload();
    });
  } catch (error) {
    alert('배송 전인 주문 건만 삭제 가능합니다.');
    console.error(error);
  }
};

// 실행 파트

//다음페이지 버튼
nextPageBtn.addEventListener('click', () => {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page');
  console.log(page, 'page params');
  if (page === null) {
    currentUrl.searchParams.set('page', 2);
  } else {
    currentUrl.searchParams.set('page', parseInt(page) + 1);
  }

  window.location.href = currentUrl.toString();
  console.log(currentUrl.toString());
});

//이전 페이지 버튼
previousPageBtn.addEventListener('click', () => {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page');
  console.log(page, 'page params');
  if (page == '1' || page == null) {
    alert('첫페이지입니다.');
  } else {
    currentUrl.searchParams.set('page', parseInt(page) - 1);
  }

  window.location.href = currentUrl.toString();
  console.log(currentUrl.toString());
});

await adminGetOrderAPI();

for (var value of orderList) {
  // total 금액 계산 코드
  let totalPrice = 0;
  for (var product of value.productList) {
    totalPrice += product.productId.productPrice;
  }
  // 날짜 변환 코드
  const date = new Date(value.createdAt);
  const formattedDate = `${date.getFullYear()}.${
    date.getMonth() + 1
  }.${date.getDate()}`;

  // 상품 갯수
  let len = value.productList.length - 1;

  orderListDiv.insertAdjacentHTML(
    'afterbegin',
    ` <div class="container mx-auto" id="product-list-div">
        <div
          class="bg-gray-200 py-2 flex items-center gap-x-12 px-4 my-2 rounded-md border-b-2 border-gray-300"
          id=${value._id}
        >
          <div class="w-1/4">${formattedDate}</div>
          <div class="w-1/4 break-words">${value.productList[0].productId.productName}<br> 외 ${len}개</div>
          <div class="w-1/4 ml-6">${totalPrice}</div>

          <div class="w-1/4 text-ellipsis overflow-hidden">${value.shippingStatus}
          </div>
          <div class="flex flex-row items-center w-20">
            <button
              class="order-update-btn w-10 h-10 border border-slate-500 bg-white  rounded-lg"
              name=${value._id}
            >
              수정
            </button>
            <button
              class="order-delete-btn w-10 h-10 border border-slate-500 bg-white  rounded-lg"
              name=${value._id}
            >
              삭제
            </button>
          </div>
        </div>      `,
  );
}

for (let value of orderUpdateBtn) {
  let listID = value.name;
  const eachListDiv = document.getElementById(listID);

  value.addEventListener('click', () => {
    // console.log(listID, '각 요소의 id값');

    eachListDiv.innerHTML = `

    <div class="w-1/4" id="${listID}put1">${eachListDiv.children[0].innerText}</div>
    <div class="w-1/4" id="${listID}put2">${eachListDiv.children[1].innerText}</div>
    <div class="w-1/4" id="${listID}put3">${eachListDiv.children[2].innerText}</div>
    <select id="mySelect" class="w-1/4">
      <option value="배송전">배송전</option>
      <option value="배송중">배송중</option>
      <option value="배송완료">배송완료</option>
    </select>
    <div class="flex flex-row items-center">
      <button
      id="${listID}complete"
      class="w-10 h-10 border border-slate-500 bg-white  rounded-lg"
      >
        완료
      </button>
      <button
        id="${listID}cancel"
        class="w-10 h-10 border border-slate-500 bg-white  rounded-lg"
      >
        취소
      </button>
    </div>
    `;

    const selectStatus = document.getElementById(`mySelect`);
    let selectedValue = '배송전';

    selectStatus.addEventListener('change', (e) => {
      selectedValue = e.target.value;
    });

    const completeBtn = document.getElementById(`${listID}complete`);
    const cancelBtn = document.getElementById(`${listID}cancel`);

    completeBtn.addEventListener('click', async () => {
      // axios 작동

      let data = {
        shippingStatus: selectedValue,
      };

      await adminPutOrderAPI(data, listID);
    });

    cancelBtn.addEventListener('click', () => {
      window.location.reload();
    });
  });
}

//삭제 버튼
for (let value of orderDeleteBtn) {
  let listID = value.name;

  value.addEventListener('click', async () => {
    await adminDeleteOrderAPI(listID);
  });
}
