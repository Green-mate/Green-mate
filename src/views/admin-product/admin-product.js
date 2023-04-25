// newimg 변경
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.6/+esm';

const token = localStorage.getItem('token');

const addBtn = document.getElementById('addBtn');
const addContentDiv = document.getElementById('add-content-div');
const cancleBtn = document.getElementById('cancleBtn');

const productListDiv = document.getElementById('product-list-div');
const productPostBtn = document.getElementById('post-product-btn');
const productUpdateBtn = document.getElementsByClassName('product-update-btn');
const productDeleteBtn = document.getElementsByClassName('product-delete-btn');

let newImg = '';
const thumbnailInputUpload = document.getElementById(`thumbnail-input`);
const upload = document.getElementById(`upload`);

function getImageFiles(e) {
  const files = e.currentTarget.files[0];
  console.log(typeof files, files);

  // url로 변경
  newImg = URL.createObjectURL(files);
  console.log(newImg);
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

function hangulEncoder(queryParams) {
  const kor_reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글인지 식별해주기 위한 정규표현식

  if (queryParams.match(kor_reg)) {
    const encodeQuery = encodeURI(queryParams);
    return encodeQuery;
  } else {
    return queryParams;
  }
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
    stock: addContentDiv.children[3].value,
    productImage: newImg,
  };

  console.log(data);

  await adminPostProductAPI(data);
});

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
      Authorization: `Bearer ${token}`,
    },
  };

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
  const encodedSearchID = hangulEncoder(id);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    await axios
      .patch(`/api/admin/products?items=${encodedSearchID}`, data, config)
      .then((response) => {
        window.location.reload();
      });
  } catch (error) {
    console.error(error);
  }
};

const adminDeleteProductAPI = async (id) => {
  const encodedSearchID = hangulEncoder(id);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  };

  try {
    await axios
      .delete(`/api/admin/products?item=${encodedSearchID}`, config)
      .then((res) => {
        window.location.reload();
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
          <img src=${value.productImage} class="w-20 h-20" >
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
//     <input type="file" class="w-1/5"       id="${listID}put5" ></input>
for (let value of productUpdateBtn) {
  let listID = value.name;
  const eachListDiv = document.getElementById(listID);

  value.addEventListener('click', () => {
    // console.log(listID, '각 요소의 id값');

    eachListDiv.innerHTML = `

    <input class="w-1/5" id="${listID}put1" value=${eachListDiv.children[0].innerText} disabled></input>
    <input class="w-1/5" id="${listID}put2" value=${eachListDiv.children[1].innerText}></input>
    <input class="w-1/5" id="${listID}put3" value=${eachListDiv.children[2].innerText}></input>
    <input class="w-1/5" id="${listID}put4" value=${eachListDiv.children[3].innerText}></input>
    <div class="flex flex-col justify-center items-center w-1/5 h-10">
      <input
        style="display: none"
        class="hadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none mb-5"
        id="${listID}thumbnail-input"

        type="file"
      />

      <img
        src="../dist/uploadimg.png"
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
        productImage:
          'https://nongsaro.go.kr/cms_contents/301/15831_MF_REPR_ATTACH_01.jpg', // imageValue || newImg,
      };
      console.log(data);
      await adminPutProductAPI(data, nameValue.value);
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

// productPostBtn.addEventListener('click', async () => {
//   let newImg = '';
//   const thumbnailInputUpload = document.getElementById(`thumbnail-input`);
//   const upload = document.getElementById(`upload`);

//   const postInput1 = document.getElementById('post-input1');
//   const postInput2 = document.getElementById('post-input2');
//   const postInput3 = document.getElementById('post-input3');
//   const postInput4 = document.getElementById('post-input4');

//   function getImageFiles(e) {
//     const files = e.currentTarget.files[0];
//     console.log(typeof files, files);
//     newImg = files;
//   }

//   upload.addEventListener('click', () => thumbnailInputUpload.click());
//   thumbnailInputUpload.addEventListener('change', getImageFiles);

//   thumbnailInputUpload.addEventListener('change', () => {
//     console.log('dsfaf');
//     if (thumbnailInputUpload.files && thumbnailInputUpload.files[0]) {
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         upload.src = e.target.result;
//       };

//       reader.readAsDataURL(thumbnailInputUpload.files[0]);
//     }
//   });

//   // console.log(postInput1.value);
//   // console.log(postInput2.value);
//   // console.log(postInput3.value);
//   // console.log(postInput4.value);

//   let data = {
//     productName: postInput1.value,
//     category: postInput2.value,
//     productPrice: parseInt(postInput3.value),
//     productImage: 'newImg',
//     stock: parseInt(postInput4.value),
//   };
//   await adminPostProductAPI(data);
// });
