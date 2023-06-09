let pathname = window.location.pathname;
pathname = pathname.substring(1, pathname.length - 1);

// 요소(element), input 혹은 상수
const orderLink = document.getElementById('order-manage-link');
const categoryLink = document.getElementById('category-manage-link');
const productLink = document.getElementById('product-manage-link');

// 초기 주문관리 선택

if (pathname === 'admin-order') {
  orderLink.classList.toggle('bg-lime-500');
} else if (pathname === 'admin-category') {
  categoryLink.classList.toggle('bg-lime-500');
} else {
  productLink.classList.toggle('bg-lime-500');
}
