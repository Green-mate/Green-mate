import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.6/+esm';

const addBtn = document.getElementById('addBtn');
const postCategoryBtn = document.getElementById('post-category-btn');
const categoryInput = document.getElementById('category-input');
const addContentDiv = document.getElementById('add-content-div');
const categoryListDiv = document.getElementById('category-list-div');
const cancleBtn = document.getElementById('cancleBtn');
const categoryUpdateBtn = document.getElementsByClassName(
  'category-update-btn',
);
const categoryDeleteBtn = document.getElementsByClassName(
  'category-delete-btn',
);

let categoryList = [];

// 정의 파트

const adminGetCategoryAPI = async () => {
  try {
    await axios.get(`/api/admin/categories`).then((response) => {
      categoryList = response.data;
    });
  } catch (error) {
    console.error(error);
  }
};

const adminPostCategoryAPI = async (data) => {
  const config = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQwYTUxNDNlZjRjZjlkNGEyMDE4ZjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODIxNDAxMjV9.pfKeseBdzQafcW9-Dl_XBHWRmYQheQTzh1TzXpNA_XY`,
    },
  };

  try {
    await axios.post(`/api/admin/categories`, data, config).then((response) => {
      window.location.reload();
    });
  } catch (error) {
    console.error(error);
  }
};

const adminPutCategoryAPI = async (data, id) => {
  const config = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQwYTUxNDNlZjRjZjlkNGEyMDE4ZjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODIxNDAxMjV9.pfKeseBdzQafcW9-Dl_XBHWRmYQheQTzh1TzXpNA_XY`,
    },
  };

  try {
    await axios
      .put(`/api/admin/categories/${id}`, data, config)
      .then((response) => {
        window.location.reload();
      });
  } catch (error) {
    console.error(error);
  }
};

const adminDeleteCategoryAPI = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQwYTUxNDNlZjRjZjlkNGEyMDE4ZjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODIxNDAxMjV9.pfKeseBdzQafcW9-Dl_XBHWRmYQheQTzh1TzXpNA_XY`,
    },
  };

  try {
    await axios.delete(`/api/admin/categories/${id}`, config);
  } catch (error) {
    console.error(error);
  }
};

// 등록 파트

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

postCategoryBtn.addEventListener('click', async () => {
  let data = {
    categoryName: categoryInput.value,
  };
  await adminPostCategoryAPI(data);
});

// 실행 파트

await adminGetCategoryAPI();

for (var value of categoryList) {
  categoryListDiv.insertAdjacentHTML(
    'afterbegin',
    ` <div
        class="bg-gray-200 py-2 flex justify-center items-center my-2 rounded-md border-b-2 border-gray-300"
        id=${value._id}
        style=" display : "" "
      >
      ${value.categoryName}
        <button
          class="category-update-btn w-15 border border-slate-500 bg-white py-1 px-2 rounded-lg m-2"
          name=${value._id}
        >
          수정
        </button>
        <button
          class="category-delete-btn w-15 border border-slate-500 bg-white py-1 px-2 rounded-lg"
          name="${value._id}"
        >
          삭제
        </button>
      </div>
      `,
  );
}

//업뎃 버튼

for (let value of categoryUpdateBtn) {
  let listID = value.name;
  const eachListDiv = document.getElementById(listID);

  value.addEventListener('click', () => {
    // console.log(listID, '각 요소의 id값');
    // console.log(eachListDiv);
    eachListDiv.innerHTML = `
    <input id="${listID}put" value=${eachListDiv.innerText}></input>
    <button id="${listID}complete">완료</button>
    <button id="${listID}cancel">취소</button>
    `;

    const completeBtn = document.getElementById(`${listID}complete`);
    const cancelBtn = document.getElementById(`${listID}cancel`);
    const putInput = document.getElementById(`${listID}put`);

    completeBtn.addEventListener('click', async () => {
      // axios 작동
      let data = {
        categoryName: putInput.value,
      };
      await adminPutCategoryAPI(data, listID);
      // console.log('axios', listID);
    });

    cancelBtn.addEventListener('click', () => {
      window.location.reload();
    });
  });
}

//삭제 버튼
for (let value of categoryDeleteBtn) {
  let listID = value.name;

  value.addEventListener('click', async () => {
    await adminDeleteCategoryAPI(listID);
    window.location.reload();
  });
}
