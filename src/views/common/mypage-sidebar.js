let pathname = window.location.pathname;
pathname = pathname.substring(1, pathname.length - 1);

// 요소(element), input 혹은 상수
const profileLink = document.getElementById('profile-manage-link');
const userOrderLink = document.getElementById('user-order-manage-link');
const secessionLink = document.getElementById('secession-link');

// 초기 주문관리 선택

if (pathname === 'mypage-order') {
  profileLink.classList.toggle('bg-lime-500');
} else if (pathname === 'mypage-shipping') {
  userOrderLink.classList.toggle('bg-lime-500');
} else {
  secessionLink.classList.toggle('bg-lime-500');
}
