// 요소(element), input 혹은 상수
const orderLink = document.getElementById('order-manage-link');
const categoryLink = document.getElementById('category-manage-link');
const productLink = document.getElementById('product-manage-link');

const orderContent = document.getElementById('order-manage-content');
const categoryContent = document.getElementById('category-manage-content');
const productContent = document.getElementById('product-manage-content');

// 초기 주문관리 선택
orderLink.classList.toggle('bg-lime-500');

// 버튼 누를 시 다른 요소 색 x
function resetLinks() {
  orderLink.classList.remove('bg-lime-500');
  categoryLink.classList.remove('bg-lime-500');
  productLink.classList.remove('bg-lime-500');
}

orderLink.addEventListener('click', () => {
  resetLinks();
  orderLink.classList.toggle('bg-lime-500');

  orderContent.style.display = 'block';
  categoryContent.style.display = 'none';
  productContent.style.display = 'none';
});

categoryLink.addEventListener('click', () => {
  resetLinks();
  categoryLink.classList.toggle('bg-lime-500');

  orderContent.style.display = 'none';
  categoryContent.style.display = 'block';
  productContent.style.display = 'none';
});

productLink.addEventListener('click', () => {
  resetLinks();
  productLink.classList.toggle('bg-lime-500');

  orderContent.style.display = 'none';
  categoryContent.style.display = 'none';
  productContent.style.display = 'block';
});
