// JavaScript 코드
const list = document.querySelector('#list');
const pagination = document.querySelector('#pagination');
let currentPage = 1;

const fetchData = async (page) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`,
  );
  const data = await response.json();
  return data;
};

const updateUI = (data) => {
  list.innerHTML = '';
  data.forEach((item) => {
    const listItem = document.createElement('div');
    listItem.innerText = item.title;
    list.appendChild(listItem);
  });
};

const createPaginationItem = (page) => {
  const paginationItem = document.createElement('span');
  paginationItem.innerText = page;
  paginationItem.addEventListener('click', () => {
    currentPage = page;
    fetchData(currentPage).then((data) => updateUI(data));
  });
  return paginationItem;
};

const updatePagination = (currentPage, totalPage) => {
  pagination.innerHTML = '';
  for (let i = 1; i <= totalPage; i++) {
    const paginationItem = createPaginationItem(i);
    if (i === currentPage) {
      paginationItem.classList.add('active');
    }
    pagination.appendChild(paginationItem);
  }
};

const init = async () => {
  const data = await fetchData(currentPage);
  updateUI(data);
  updatePagination(currentPage, Math.ceil(data.length / 10));
};

init();
