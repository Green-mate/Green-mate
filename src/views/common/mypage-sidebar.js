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
      href="/mypage"
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
    <button
      id="secession-btn"
      class="my-2 px-2 py-1 flex items-center rounded-lg hover:bg-lime-500"
    >
      <span class="mx-3">회원탈퇴</span>
    </button>
  </div>
  </div>`;
}

renderCategoryBar();

let pathname = window.location.pathname;
pathname = pathname.substring(1, pathname.length - 1);

// 요소(element), input 혹은 상수
const profileLink = document.getElementById('profile-manage-link');
const userOrderLink = document.getElementById('user-order-manage-link');
const secessionBtn = document.getElementById('secession-btn');

// 초기 주문관리 선택

if (pathname === 'mypage') {
  profileLink.classList.toggle('bg-lime-500');
} else if (pathname === 'mypage-shipping') {
  userOrderLink.classList.toggle('bg-lime-500');
} else {
  secessionLink.classList.toggle('bg-lime-500');
}

function handleSecession() {
  confirm(
    '회원 탈퇴 하시겠습니까? \n배송중인 상품에 대해서는 책임을 지지 않겠습니다.',
  );
  window.location.href = '/';
  /**
   * api
   */
}

secessionBtn.addEventListener('click', handleSecession);
