const adminLabel = '관리자 페이지';
const myPageLabel = '마이페이지';
const loginLabel = '로그인';
const logoutLabel = '로그아웃';
const registerLabel = '회원가입';

// const input1 = confirm('로그인하시겠슴?');
// const input2 = prompt('관리자 or 일반?');
let firstLabel = loginLabel;
let secondLabel = registerLabel;

// if (input1) {
//   secondLabel = logoutLabel;
//   if (input2 === '관리자') {
//     firstLabel = adminLabel;
//   } else {
//     firstLabel = myPageLabel;
//   }
// } else {
//   firstLabel = loginLabel;
//   secondLabel = registerLabel;
// }

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
      <li id="admin-menu" class="text-gray-500 text-lg font-bold mr-8">
        <a href="/login">${firstLabel}</a>
      </li>
      <li id="signin-menu" class="text-gray-500 text-lg font-bold mr-8">
        <a href="/register">${secondLabel}</a>
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
      <img src="../dist/logo-1.png" width="150" height="150" />
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
    <p class="text-gray-400 text-sm">FE : 김희삼 신하영 진호병</p>
    <span class="text-gray-400 text-sm mx-2">|</span>
    <p class="text-gray-400 text-sm">BE : 김마리나 류이서 류한나</p>
    <span class="text-gray-400 text-sm mx-2">|</span>
    <p class="text-gray-400 text-sm">저작권 : 푸르다마켓</p>
  </div>
</footer>
  `;
  document.body.append(footer);
}

// Render Header and Footer
renderHeader();
renderFooter();
