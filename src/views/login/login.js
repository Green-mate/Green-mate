import * as API from '../api.js';
import {
  blockAfterLogin,
  getUrlParams,
  validateEmail,
} from '/useful-functions.js';

// 요소(element), input 혹은 상수
const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const submitButton = document.querySelector('#submit-button');

blockAfterLogin();
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
}

// 로그인 진행
async function handleSubmit(e) {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  // 잘 입력했는지 확인
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;

  // 이메일이 틀렸을 때 이메일이 틀렸다 알려주고, 비밀번호가 틀렸을 때 비밀번호가 틀렸다 알려주는 것은
  // 악의적으로 사용될 수 있다고함 -> 보통 사이트들도 실패만 알려주고 뭐가 틀렸는지는 안알려줌
  if (!isEmailValid || !isPasswordValid) {
    return alert(
      '비밀번호가 4글자 이상인지, 이메일 형태가 맞는지 확인해 주세요.',
    );
  }

  // 로그인 api 요청
  try {
    const data = { email, password };

    const result = await API.postWithoutToken('/api/users/login', data);
    const token = result.token;
    const userId = result.userId;
    const role = result.role;

    // 로그인 성공, 토큰, 유저정보 로컬 스토리지에 저장
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', role);
    alert(`정상적으로 로그인되었습니다.`);

    const { previousPage } = getUrlParams();
    console.log('previousPage', previousPage);
    if (previousPage) {
      window.location.href = previousPage;
      return;
    }
    // 기본 페이지로 이동
    window.location.href = '/';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
