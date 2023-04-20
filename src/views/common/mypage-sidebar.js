function renderCategoryBar() {
  const categoryBar = document.querySelector('#mypage-sidebar');

  categoryBar.innerHTML = `<div class="flex flex-col flex-shrink-0 w-64">
  <div
    class="flex items-center justify-center h-28 border-b border-gray-500 bg-white"
  >
    <span class="text-2xl text-black font-bold">Bicco님</span>
  </div>
  <div class="flex flex-col p-4">
    <a
      href="#"
      id="profile-manage-link"
      class="my-2 px-2 py-1 flex items-center rounded-lg hover:bg-lime-500"
    >
      <span class="mx-3">회원정보수정</span>
    </a>
    <a
      href="/mypage-shipping"
      id="user-order-manage-link"
      class="my-2 px-2 py-1 flex items-center rounded-lg hover:bg-lime-500"
    >
      <span class="mx-3">주문/배송조회</span>
    </a>
    <a
      href="#"
      id="secession-link"
      class="my-2 px-2 py-1 flex items-center rounded-lg hover:bg-lime-500"
    >
      <span class="mx-3">회원탈퇴</span>
    </a>
  </div>
  </div>`;
}

renderCategoryBar();

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
