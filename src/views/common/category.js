import * as API from '../api.js';

const categoryBar = document.querySelector('#category-menu-navbar');
const wholeCategory = document.querySelector('#whole-product-category');
getCategoryList();
// 초기 sessionStorage
sessionStorage.setItem('selectedCategory', 'all');

// 전체 상품 이외 생성될 카테고리
function createCategory({ categoryName }) {
  const categoryElem = document.createElement('li');
  const categoryLinkElem = document.createElement('a');

  // 하나의 카테고리 속성 부여
  categoryLinkElem.textContent = categoryName;
  categoryLinkElem.classList.add('cursor-pointer');
  categoryElem.classList.add('text-lg', 'font-bold', 'hover:text-[#69b766]');
  categoryElem.setAttribute('id', 'category');

  // 카테고리 element 동적 생성
  categoryElem.appendChild(categoryLinkElem);

  /**
   * 카테고리 클릭시, 클릭한 카테고리 이름 세션 스토리지에 저장
   * 클릭한 카테고리 text색상 및 sessionStorage변경
   */
  categoryElem.addEventListener('click', () => {
    sessionStorage.setItem('selectedCategory', categoryName);
    const categoryLiList = document.querySelectorAll('#category');
    categoryLiList.forEach((categoryLi) => {
      if (sessionStorage.getItem('selectedCategory') !== 'all') {
        wholeCategory.classList.remove('text-[#69b766]');
      }
      categoryLi.children[0].classList.remove('text-[#69b766]');
    });
    categoryLinkElem.classList.add('text-[#69b766]');
  });

  categoryBar.appendChild(categoryElem);
}

wholeCategory.addEventListener('click', () => {
  sessionStorage.setItem('selectedCategory', 'all');

  if (sessionStorage.getItem('selectedCategory') === 'all') {
    wholeCategory.classList.toggle('text-[#69b766]');
  }
});

// 카테고리 명 받아오는 함수(API)
async function getCategoryList() {
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

  const categoryList = categories.map((category) => {
    createCategory(category);
    return category;
  });

  return categoryList;
}
