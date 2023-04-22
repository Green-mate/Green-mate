import * as API from '../api.js';
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.6/+esm';

const categoryBar = document.querySelector('#category-menu-navbar');

function renderAllProductCategoryLabel() {
  categoryBar.innerHTML = `
  <li class="text-lg font-bold hover:text-[#69b766]">
    <a class="cursor-pointer" aria-current="page">전체상품</a>
  </li>`;
}

renderAllProductCategoryLabel();

function createCategory(category) {
  categoryBar.innerHTML += `
  <li class="text-lg font-bold hover:text-[#69b766]">
    <a class="cursor-pointer">${category.categoryName}</a>
  </li>
  `;
}

getCategoryList();
async function getCategoryList() {
  // /api/admin/categories
  // try{
  // const response = await axios.get('category.json');
  // const categories = await response.data;
  // console.log(categories);
  const categories = [
    {
      id: '1',
      categoryName: '직립형',
    },
    {
      id: '2',
      categoryName: '관목형',
    },
    {
      id: '3',
      categoryName: '덩굴성',
    },
    {
      id: '4',
      categoryName: '풀모양',
    },
    {
      id: '5',
      categoryName: '로제트형',
    },
    {
      id: '6',
      categoryName: '다육형',
    },
  ];

  const categoryList = categories.forEach((category) => {
    createCategory(category);
  });
  return categoryList;
}
