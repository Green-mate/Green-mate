import * as API from '../api.js';

const userName = sessionStorage.getItem('userName');
const uid = localStorage.getItem('userId');

function renderCategoryBar() {
  const categoryBar = document.querySelector('#mypage-sidebar');

  categoryBar.innerHTML = `
  <div class="flex flex-col flex-shrink-0 w-64">
  <div
    class="flex items-center justify-center h-28 border-b my-4 border-gray-300"
  >
    <div class="items-end">
      <span id="user-name" class="text-2xl text-black font-bold">${userName}</span>
      <span class="text-lg text-black">님 안녕하세요!</span>
    </div>
  </div>
  <div class="flex flex-col p-4">
    <a
      href="/mypage"
      id="profile-manage-link"
      class="my-2 px-2 py-1 flex items-center rounded-lg hover:bg-[#CDDEBA] hover:text-white"
    >
      <span class="mx-3 font-semibold">회원정보수정</span>
    </a>
    <a
      href="/mypage-shipping"
      id="user-order-manage-link"
      class="my-2 px-2 py-1 flex items-center rounded-lg hover:bg-[#CDDEBA] hover:text-white"
    >
      <span class="mx-3 font-semibold">주문/배송조회</span>
    </a>
    <button
      id="secession-btn"
      class="my-2 px-2 py-1 flex items-center rounded-lg hover:bg-[#CDDEBA] hover:text-white"
    >
      <span class="mx-3 font-semibold">회원탈퇴</span>
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
  profileLink.classList.toggle('bg-[#CDDEBA]');
} else if (pathname === 'mypage-shipping' || 'mypage-shipping-edit') {
  userOrderLink.classList.toggle('bg-[#CDDEBA]');
} else {
  secessionBtn.classList.toggle('bg-[#CDDEBA]');
}

secessionBtn.addEventListener('click', handleSecession);

// /api/users/delete/:uid/
async function handleSecession() {
  const secessionAnswer = confirm(
    '회원 탈퇴 하시겠습니까? \n배송중인 상품에 대해서는 책임을 지지 않겠습니다.',
  );
  if (secessionAnswer) {
    try {
      const result = await API.patchWithoutData('/api/users/delete', `${uid}`);
      console.log(result);
      localStorage.clear();
      sessionStorage.clear();
      alert('회원 정보가 삭제되었습니다.');
      window.location.href = '/';
    } catch (err) {
      alert(`회원정보 삭제 과정에서 오류가 발생하였습니다: ${err}`);
    }
  } else {
    window.location.href = '/mypage';
  }
}
