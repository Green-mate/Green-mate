const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

// Render Header and Footer
if (token) {
  if (role === 'basic-user') renderBasicHeader();
  else if (role === 'admin') renderAdminHeader();
  // logout -> window.onload로 감싼 이유 -> Cannot read property 'addEventListener' of null 해결위함
  window.onload = function () {
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', handleLogout);
    function handleLogout(e) {
      e.preventDefault();
      const answer = confirm('로그아웃 하시겠습니까?');
      if (answer) {
        alert('로그아웃이 완료되었습니다.\n다음에 또 오세요👋');
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
      }
    }
  };
} else {
  renderHeader();
}
renderFooter();

// 로그인 && 일반 사용자 헤더
function renderBasicHeader() {
  const header = document.createElement('header');

  header.innerHTML = `
  <header class="mx-auto px-0 box-border flex flex-col p-10">
  <nav
    class="flex flex-row justify-end"
    id="navbar"
    role="navigation"
    aria-label="main navigation"
  >
    <ul id="user-menu-navbar" class="flex justify-end">
    <li id="user-menu" class="text-gray-500 text-lg font-bold mr-8">
      <a href="/mypage">마이페이지</a>
    </li>
    <li id="logout-btn-menu" class="text-gray-500 text-lg font-bold mr-8">
        <button id="logout-btn">로그아웃</button>
    </li>
    <li id="cart-menu" class="text-gray-500 text-lg font-bold">
      <a href="/cart" aria-current="page">
        <span>장바구니</span>
        <span>
          <i class="fas fa-cart-shopping"></i>
        </span>
      </a>
    </li>
    </ul>
  </nav>
  <div id="navbar-logo" class="mt-5 flex justify-center items-center">
    <a class="navbar-item" href="/">
      <img src="/static/logo-1.png" width="150" height="150" />
    </a>
  </div>
</header>
  `;
  document.body.prepend(header);
}

// 로그인 && 관리자 헤더
function renderAdminHeader() {
  const header = document.createElement('header');

  header.innerHTML = `
  <header class="mx-auto px-0 box-border flex flex-col p-10">
  <nav
    class="flex flex-row justify-end"
    id="navbar"
    role="navigation"
    aria-label="main navigation"
  >
    <ul id="user-menu-navbar" class="flex justify-end">
      <li id="admin-menu" class="text-gray-500 text-lg font-bold mr-8">
        <a href="/admin-order">관리자페이지</a>
      </li>
      <li id="user-menu" class="text-gray-500 text-lg font-bold mr-8">
        <a href="/mypage">마이페이지</a>
      </li>
      <li id="logout-btn-menu" class="text-gray-500 text-lg font-bold mr-8">
        <button id="logout-btn">로그아웃</button>
      </li>
      <li id="cart-menu" class="text-gray-500 text-lg font-bold">
        <a href="/cart" aria-current="page">
          <span>장바구니</span>
          <span>
            <i class="fas fa-cart-shopping"></i>
          </span>
        </a>
      </li>
    </ul>
  </nav>
  <div id="navbar-logo" class="mt-5 flex justify-center items-center">
    <a class="navbar-item" href="/">
      <img src="/static/logo-1.png" width="150" height="150" />
    </a>
  </div>
</header>
  `;
  document.body.prepend(header);
}

// 로그아웃 상태 헤더(default)
function renderHeader() {
  const header = document.createElement('header');

  header.innerHTML = `
  <header class="mx-auto px-0 box-border flex flex-col p-10">
  <nav
    class="flex flex-row justify-end"
    id="navbar"
    role="navigation"
    aria-label="main navigation"
  >
    <ul id="user-menu-navbar" class="flex justify-end">
      <li id="login-menu" class="text-gray-500 text-lg font-bold mr-8">
        <a href="/login">로그인</a>
      </li>
      <li id="register-menu" class="text-gray-500 text-lg font-bold mr-8">
        <a href="/register">회원가입</a>
      </li>
    
      <li id="cart-menu" class="text-gray-500 text-lg font-bold">
        <a href="/cart" aria-current="page">
          <span>장바구니</span>
          <span>
            <i class="fas fa-cart-shopping"></i>
          </span>
        </a>
      </li>
    </ul>
  </nav>
  <div id="navbar-logo" class="mt-5 flex justify-center items-center">
    <a class="navbar-item" href="/">
      <img src="/static/logo-1.png" width="150" height="150"/>
    </a>
  </div>
</header>
  `;
  document.body.prepend(header);
}

// Footer Component
function renderFooter() {
  const footer = document.createElement('footer');
  footer.innerHTML = `
  <footer class="bg-gray-500 text-white py-4 mt-10">
  <div class="max-w-6xl mx-auto flex justify-center items-center">
    <p class="text-gray-400 text-sm">© 2023 그린메이트</p>
    <span class="text-gray-400 text-sm mx-2">|</span>
    <p class="text-gray-400 text-sm">FE : 신하영 진호병</p>
    <span class="text-gray-400 text-sm mx-2">|</span>
    <p class="text-gray-400 text-sm">BE : 김마리나 류이서 류한나</p>
  </div>
</footer>
  `;
  document.body.append(footer);
}
