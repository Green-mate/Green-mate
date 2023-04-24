import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.6/+esm';

const addBtn = document.getElementById('addBtn');
const addContentDiv = document.getElementById('add-content-div');
const cancleBtn = document.getElementById('cancleBtn');
const thumbnailInputUpload = document.getElementById('thumbnail-input');
const upload = document.getElementById('upload');
const productListDiv = document.getElementById('product-list-div');
const productPostBtn = document.getElementById('post-product-btn');
const productUpdateBtn = document.getElementsByClassName('product-update-btn');
const productDeleteBtn = document.getElementsByClassName('product-delete-btn');

function getImageFiles(e) {
  const files = e.currentTarget.files;
  console.log(typeof files, files);
}

addBtn.addEventListener('click', () => {
  addContentDiv.style.display = '';
  addBtn.style.display = 'none';
  cancleBtn.style.display = '';
});

cancleBtn.addEventListener('click', () => {
  addContentDiv.style.display = 'none';
  addBtn.style.display = '';
  cancleBtn.style.display = 'none';
});

productPostBtn.addEventListener('click', async () => {
  let data = {
    productName: addContentDiv.children[0].value,
    category: addContentDiv.children[1].value,
    productPrice: addContentDiv.children[2].value,
    productImage: addContentDiv.children[3].value,
    stock: addContentDiv.children[4].value,
  };

  await adminProductCategoryAPI(data);
});

// upload.addEventListener('click', () => thumbnailInputUpload.click());
// thumbnailInputUpload.addEventListener('change', getImageFiles);

// thumbnailInputUpload.addEventListener('change', () => {
//   if (thumbnailInputUpload.files && thumbnailInputUpload.files[0]) {
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       upload.src = e.target.result;
//     };

//     reader.readAsDataURL(thumbnailInputUpload.files[0]);
//   }
// });

let productList = [];

// 정의 파트

const adminGetProductAPI = async () => {
  const config = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQwYTUxNDNlZjRjZjlkNGEyMDE4ZjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODIxNDAxMjV9.pfKeseBdzQafcW9-Dl_XBHWRmYQheQTzh1TzXpNA_XY`,
    },
  };
  try {
    await axios.get(`/api/admin/products`, config).then((response) => {
      console.log(response.data);
      productList = response.data;
    });
  } catch (error) {
    console.error(error);
  }
};

const adminProductCategoryAPI = async (data) => {
  const config = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQwYTUxNDNlZjRjZjlkNGEyMDE4ZjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODIxNDAxMjV9.pfKeseBdzQafcW9-Dl_XBHWRmYQheQTzh1TzXpNA_XY`,
    },
  };

  try {
    await axios.post(`/api/admin/products`, data, config).then((response) => {
      window.location.reload();
    });
  } catch (error) {
    console.error(error);
  }
};

const adminDeleteProductAPI = async (id) => {
  const encodedSearchID = encodeURIComponent(id);
  const config = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQwYTUxNDNlZjRjZjlkNGEyMDE4ZjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODIxNDAxMjV9.pfKeseBdzQafcW9-Dl_XBHWRmYQheQTzh1TzXpNA_XY`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  };

  try {
    await axios
      .delete(`/api/admin/products/?item=${encodedSearchID}`, config)
      .then((res) => {
        console.log(res);
      });
  } catch (error) {
    console.error(error);
  }
};

// 실행 파트
await adminGetProductAPI();

for (var value of productList) {
  //value.title 이런식으로 넣기
  // 각div에 아이디 + 이름으로 id 설정하기
  // 버튼 두개에 name으로 id 넘기기
  productListDiv.insertAdjacentHTML(
    'afterbegin',
    ` <div class="container mx-auto" id="product-list-div">
        <div
          class="bg-gray-200 py-2 flex items-center gap-x-12 px-4 my-2 rounded-md border-b-2 border-gray-300"
          id=${value._id}
        >
          <div class="w-1/5">${value.productName}</div>
          <div class="w-1/5">${value.category}</div>
          <div class="w-1/5">${value.productPrice}</div>
          <div class="w-1/5 ml-6">${value.stock}</div>
          <div class="w-1/5 text-ellipsis overflow-hidden">${value.productImage}</div>
          <div class="flex flex-row items-center">
        <button
          class="product-update-btn w-10 h-10 border border-slate-500 bg-white  rounded-lg"
          name=${value._id}
        >
          수정
        </button>
        <button
          class="product-delete-btn w-10 h-10 border border-slate-500 bg-white  rounded-lg"
          name=${value.productName}
        >
          삭제
        </button>
          </div>
        </div>      `,
  );
}

for (let value of productUpdateBtn) {
  let listID = value.name;
  const eachListDiv = document.getElementById(listID);

  value.addEventListener('click', () => {
    // console.log(listID, '각 요소의 id값');

    eachListDiv.innerHTML = `

    <input class="w-1/5" id="${listID}put1" value=${eachListDiv.children[0].innerText}></input>
    <input class="w-1/5" id="${listID}put2" value=${eachListDiv.children[1].innerText}></input>
    <input class="w-1/5" id="${listID}put3" value=${eachListDiv.children[2].innerText}></input>
    <input class="w-1/5" id="${listID}put4" value=${eachListDiv.children[3].innerText}></input>
    <input class="w-1/5" id="${listID}put5" value=${eachListDiv.children[4].innerText}></input>
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

    // 5개 만들기
    const nameValue = document.getElementById(`${listID}put1`);
    const categoryValue = document.getElementById(`${listID}put2`);
    const priceValue = document.getElementById(`${listID}put3`);
    const stockValue = document.getElementById(`${listID}put4`);
    const imageValue = document.getElementById(`${listID}put5`);

    const completeBtn = document.getElementById(`${listID}complete`);
    const cancelBtn = document.getElementById(`${listID}cancel`);

    completeBtn.addEventListener('click', async () => {
      // axios 작동
      let data = {
        productName: nameValue.value,
        category: categoryValue.value,
        productPrice: priceValue.value,
        stock: stockValue.value,
        productImage: imageValue.value,
      };
      console.log(data);
      // await adminPutCategoryAPI(data, listID);
    });

    cancelBtn.addEventListener('click', () => {
      window.location.reload();
    });
  });
}

//삭제 버튼
for (let value of productDeleteBtn) {
  let listID = value.name;

  value.addEventListener('click', async () => {
    await adminDeleteProductAPI(listID);
    // window.location.reload();
  });
}
