// newimg 변경
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.6/+esm';
import { blockAdminPage } from '/useful-functions.js';
blockAdminPage();

const token = localStorage.getItem('token');

const addBtn = document.getElementById('addBtn');
const addContentDiv = document.getElementById('add-content-div');
const cancleBtn = document.getElementById('cancleBtn');

const productListDiv = document.getElementById('product-list-div');
const productPostBtn = document.getElementById('post-product-btn'); // 등록 버튼 -> HTML
const productUpdateBtn = document.getElementsByClassName('product-update-btn'); // -> 동적 상품 수정 버튼
const productDeleteBtn = document.getElementsByClassName('product-delete-btn'); // -> 동적 상품 삭제 버튼

let newImg = '';
const thumbnailInputUpload = document.getElementById(`thumbnail-input`);
const upload = document.getElementById(`upload`);

function getImageFiles(e) {
  const files = e.currentTarget.files[0];
  console.log(typeof files, files);
  newImg = files;
}

const adminGetCategoryAPI = async () => {
  try {
    await axios.get(`/api/admin/categories`).then((response) => {
      const categoryList = response.data;
      const sessionCategoryList = [];
      for (const item of categoryList) {
        sessionCategoryList.push(item.categoryName);
      }
      sessionStorage.setItem('categoryList', sessionCategoryList);
    });
  } catch (error) {
    console.error(error);
  }
};
await adminGetCategoryAPI();

upload.addEventListener('click', () => thumbnailInputUpload.click());
thumbnailInputUpload.addEventListener('change', (e) => {
  getImageFiles(e);
});

// 이미지 미리보기 이벤트 핸들러
thumbnailInputUpload.addEventListener('change', () => {
  if (thumbnailInputUpload.files && thumbnailInputUpload.files[0]) {
    const reader = new FileReader();

    reader.onload = (e) => {
      upload.src = e.target.result;
    };

    reader.readAsDataURL(thumbnailInputUpload.files[0]);
  }
});

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

/************** 체크박스 드롭다운 ***************/
const dropdown = document.getElementById('category-dropdown');
const options = document.getElementById('category-options');
const confirmBtn = document.getElementById('category-confirm');
const checkboxListItem = document.getElementById('checkbox-list');

const getSessionCategoryList = sessionStorage
  .getItem('categoryList')
  .split(',');

for (const item of getSessionCategoryList) {
  checkboxListItem.innerHTML += `
      <label class="flex items-center py-2 px-3">
          <input type="checkbox" class="form-checkbox" value="${item}">
          <span class="ml-2 text-sm font-medium">${item}</span>
      </label>`;
}

dropdown.addEventListener('click', function () {
  options.classList.toggle('hidden');
});

confirmBtn.addEventListener('click', function () {
  options.classList.add('hidden');
});

document.addEventListener('click', function (event) {
  const isClickInsideDropdown = options.contains(event.target);
  const isClickInsideButton = dropdown.contains(event.target);
  if (!isClickInsideDropdown && !isClickInsideButton) {
    options.classList.add('hidden');
  }
});

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const selectedValues = [];

checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    if (this.checked) {
      selectedValues.push(this.value);
    } else {
      const index = selectedValues.indexOf(this.value);
      if (index > -1) {
        selectedValues.splice(index, 1);
      }
    }
    dropdown.textContent =
      selectedValues.length > 0 ? selectedValues.join(', ') : '카테고리 없음';
  });
});

/*****************************/

let productList = [];

// 정의 파트

const adminGetProductAPI = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
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

const adminPostProductAPI = async (data) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };
  console.log(data);
  try {
    await axios.post(`/api/admin/products`, data, config).then((response) => {
      window.location.reload();
    });
  } catch (error) {
    alert('형식에 맞춰 입력해주세요.');
    console.error(error);
  }
};

const adminPutProductAPI = async (data, id) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    await axios
      .patch(`/api/admin/products?item=${id}`, data, config)
      .then((response) => {
        window.location.reload();
      });
  } catch (error) {
    console.error(error);
  }
};

const adminDeleteProductAPI = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    await axios.delete(`/api/admin/products?item=${id}`, config).then((res) => {
      window.location.reload();
    });
  } catch (error) {
    console.error(error);
  }
};

// 실행 파트

await adminGetProductAPI();

for (var value of productList) {
  // console.log(value.productName);
  //value.title 이런식으로 넣기
  // 각div에 아이디 + 이름으로 id 설정하기
  // 버튼 두개에 name으로 id 넘기기
  productListDiv.insertAdjacentHTML(
    'afterbegin',
    ` <div class="container mx-auto" id="product-list-div">
        <div
          class="bg-gray-200 py-2 flex items-center gap-x-12 px-4 my-2 rounded-md border-b-2 border-gray-300"
          id="${value._id}"
        >
          <div class="w-1/5">${value.productName}</div>
          <div class="w-1/5">${value.category}</div>
          <div class="w-1/5">${value.productPrice}</div>
          <div class="w-1/5 ml-6">${value.stock}</div>
          <img src="${value.productImage}" class="w-20 h-20" >
          <div class="flex flex-row items-center">
        <button
          class="product-update-btn w-10 h-10 border border-slate-500 bg-white  rounded-lg"
          name="${value._id}"
        >
          수정
        </button>
        <button
          class="product-delete-btn w-10 h-10 border border-slate-500 bg-white  rounded-lg"
          name="${value.productName}"
        >
          삭제
        </button>
          </div>
        </div>      `,
  );
}

for (let value of productUpdateBtn) {
  let listID = value.getAttribute('name');
  const eachListDiv = document.getElementById(listID);

  value.addEventListener('click', () => {
    eachListDiv.innerHTML = `

    <input name="productName" class="w-1/5" id="${listID}put1" value=${eachListDiv.children[0].innerText}></input>


    <div class="relative inline-flex w-1/5" name="categoryName" id="${listID}put2" value=${eachListDiv.children[1].innerText}>
    <button id="category-dropdown" class="py-2 text-left bg-white shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1">
      카테고리 선택
    </button>
    <div class="absolute right-0 z-10 mt-2 w-48 shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden" id="category-options">
      <div id="checkbox-list" class="py-1">
      </div>
      <div class="flex justify-end px-2 py-2">
        <button id="category-confirm" class="px-4 py-2 text-sm font-medium text-white bg-lime-500 rounded-md hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-lime-600">
         저장
        </button>
      </div>
    </div>
    </div>


    <input name="price" class="w-1/5" id="${listID}put3" value=${eachListDiv.children[2].innerText}></input>
    <input name="stock" class="w-1/5" id="${listID}put4" value=${eachListDiv.children[3].innerText}></input>
    

    <div class="flex flex-col justify-center items-center w-1/5 h-10">
      <input
        style="display: none"
        class="hadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none mb-5"
        id="${listID}thumbnail-input"
        type="file" 
        name="img" 
        accept="image/jpeg, image/png"
      />

      <img
        src="/static/uploadimg.png"
        id="${listID}upload"
        class="rounded-xl shadow focus:outline-none"
        style="width: 100px; height: 100px"
      />
    </div>

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

    let newImg = '';
    const thumbnailInputUpload = document.getElementById(
      `${listID}thumbnail-input`,
    );
    const upload = document.getElementById(`${listID}upload`);

    function getImageFiles(e) {
      const files = e.currentTarget.files[0];
      console.log(typeof files, files);
      newImg = files;
    }

    upload.addEventListener('click', () => thumbnailInputUpload.click());
    thumbnailInputUpload.addEventListener('change', getImageFiles);

    thumbnailInputUpload.addEventListener('change', () => {
      if (thumbnailInputUpload.files && thumbnailInputUpload.files[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
          upload.src = e.target.result;
        };

        reader.readAsDataURL(thumbnailInputUpload.files[0]);
      }
    });

    /************** 체크박스 드롭다운 ***************/
    const dropdown = document.getElementById('category-dropdown');
    const options = document.getElementById('category-options');
    const confirmBtn = document.getElementById('category-confirm');
    const checkboxListItem = document.getElementById('checkbox-list');

    const getSessionCategoryList = sessionStorage
      .getItem('categoryList')
      .split(',');

    for (const item of getSessionCategoryList) {
      checkboxListItem.innerHTML += `
      <label class="flex items-center py-2 px-3">
          <input type="checkbox" class="form-checkbox" value="${item}">
          <span class="ml-2 text-sm font-medium">${item}</span>
      </label>`;
    }

    dropdown.addEventListener('click', function () {
      options.classList.toggle('hidden');
    });

    confirmBtn.addEventListener('click', function () {
      options.classList.add('hidden');
    });

    document.addEventListener('click', function (event) {
      const isClickInsideDropdown = options.contains(event.target);
      const isClickInsideButton = dropdown.contains(event.target);
      if (!isClickInsideDropdown && !isClickInsideButton) {
        options.classList.add('hidden');
      }
    });

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const selectedValues = [];

    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        if (this.checked) {
          selectedValues.push(this.value);
        } else {
          const index = selectedValues.indexOf(this.value);
          if (index > -1) {
            selectedValues.splice(index, 1);
          }
        }
        dropdown.textContent =
          selectedValues.length > 0
            ? selectedValues.join(', ')
            : '카테고리 없음';
      });
    });
    /********************************************************/

    // 5개 만들기
    const nameValue = document.getElementById(`${listID}put1`);
    // const categoryValue = document.getElementById(`${listID}put2`);
    const priceValue = document.getElementById(`${listID}put3`);
    const stockValue = document.getElementById(`${listID}put4`);
    // const imageValue = document.getElementById(`${listID}put5`);

    const completeBtn = document.getElementById(`${listID}complete`);
    const cancelBtn = document.getElementById(`${listID}cancel`);

    completeBtn.addEventListener('click', async () => {
      // axios 작동
      // console.log('selected', selectedValues[0]);
      const formData = new FormData();
      formData.append('productName', nameValue.value);
      formData.append('category', selectedValues[0]);
      formData.append('productPrice', priceValue.value);
      formData.append('productImage', newImg);
      formData.append('stock', stockValue.value);

      await adminPutProductAPI(formData, nameValue.value);
    });

    cancelBtn.addEventListener('click', () => {
      window.location.reload();
    });
  });
}

//삭제 버튼
for (let value of productDeleteBtn) {
  value.addEventListener('click', async (e) => {
    let listID = e.target.getAttribute('name');
    console.log(listID);
    const answer = confirm('진짜로 삭제하시겠습니까?');
    if (answer) {
      await adminDeleteProductAPI(listID);
    }
  });
}

productPostBtn.addEventListener('click', async () => {
  const postInput1 = document.getElementById('post-input1');
  // 카테고리가 input2
  const postInput2 = document.getElementById('post-input2');
  const postInput3 = document.getElementById('post-input3');
  const postInput4 = document.getElementById('post-input4');

  const formData = new FormData();
  formData.append('productName', postInput1.value);
  formData.append('category', selectedValues[0]);
  formData.append('productPrice', postInput3.value);
  formData.append('stock', postInput4.value);

  formData.append('productImage', newImg);

  console.log('Img', newImg);

  await adminPostProductAPI(formData);
});
