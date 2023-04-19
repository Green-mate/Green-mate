// 요소(element), input 혹은 상수
const orderLink = document.getElementById('order-manage-link');
const categoryLink = document.getElementById('category-manage-link');
const productLink = document.getElementById('product-manage-link');

const orderContent = document.getElementById('order-manage-content');
const categoryContent = document.getElementById('category-manage-content');
const productContent = document.getElementById('product-manage-content');

// 초기 주문관리 선택
categoryLink.classList.toggle('bg-lime-500');

orderLink.addEventListener('click', () => {
  orderContent.style.display = 'block';
  categoryContent.style.display = 'none';
  productContent.style.display = 'none';
});

categoryLink.addEventListener('click', () => {
  orderContent.style.display = 'none';
  categoryContent.style.display = 'block';
  productContent.style.display = 'none';
});

productLink.addEventListener('click', () => {
  orderContent.style.display = 'none';
  categoryContent.style.display = 'none';
  productContent.style.display = 'block';
});
