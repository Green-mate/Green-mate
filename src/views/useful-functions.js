// 문자열+숫자로 이루어진 랜덤 5글자 반환
export const randomId = () => {
  return Math.random().toString(36).substring(2, 7);
};

// getUrlParams : 주소창의 url로부터 params를 얻어 객체로 만듦
// http://localhost:300/api/products?category=all&page=1&perPage=9 라고 한다면,
/**
 * {
 *    category: "all",
 *    page: "1",
 *    perPage: "9"
 * }
 * 요로코롬 반환해주는 함수
 */
export const getUrlParams = () => {
  // ?이후의 쿼리 문자열 추출
  const queryString = window.location.search;
  // 쿼리 문자열 파싱
  const urlParams = new URLSearchParams(queryString);

  const result = {};

  // 객체 모든 key, value쌍 순회한 뒤 result에 냅다 넣음
  for (const [key, value] of urlParams) {
    result[key] = value;
  }

  return result;
};

export const blockAfterLogin = () => {
  const token = localStorage.getItem('token');

  if (token) {
    alert('로그인 상태에서는 접근할 수 없는 페이지입니다.');
    window.location.replace('/');
  }
};

export const blockBeforeLogin = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    sessionStorage.setItem('prevPage', window.location.href);

    const response = confirm(
      '로그인한 사용자만 접근할 수 있는 페이지입니다.\n로그인 하시겠습니까?',
    );
    if (response) {
      window.location.replace('/login');
    } else {
      window.location.replace('/');
    }
  }
};

export const blockAdminPage = () => {
  const role = localStorage.getItem('role');

  if (role !== 'admin') {
    alert('관리자만 접근 가능한 페이지입니다.');
    window.location.replace('/');
  }
};

// 이메일 형식인지 확인 (true 혹은 false 반환)
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

// 숫자에 쉼표를 추가함. (10000 -> 10,000)
export const addCommas = (n) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 13,000원, 2개 등의 문자열에서 쉼표, 글자 등 제외 후 숫자만 뺴냄
// 예시: 13,000원 -> 13000, 20,000개 -> 20000
export const convertToNumber = (string) => {
  return parseInt(string.replace(/(,|개|원)/g, ''));
};

// ms만큼 기다리게 함.
export const wait = (ms) => {
  return new Promise((r) => setTimeout(r, ms));
};

// 해당 주소로 이동하는 콜백함수를 반환함.
// 이벤트 핸들 함수로 쓰면 유용함
export const navigate = (pathname) => {
  return function () {
    window.location.href = pathname;
  };
};
