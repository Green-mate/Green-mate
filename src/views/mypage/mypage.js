import * as API from '../api.js';
import { blockBeforeLogin } from '/useful-functions.js';
import { renderCategoryBar } from '../common/mypage-sidebar.js';

const submitBtn = document.getElementById('submit-button');
const emailValue = document.getElementById('email-text-value');

// 수정 성공 후 인풋창 비울 때 Assignment to constant variable.
let nameInputVal = document.getElementById('name-input');
let currentPasswordInputVal = document.getElementById('password-input');
let newPasswordInputVal = document.getElementById('new-password-input');
let newPasswordInputChkVal = document.getElementById(
  'new-password-check-input',
);

const uid = localStorage.getItem('userId');

blockBeforeLogin();
getUserInfo();
addAllEvents();

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitBtn.addEventListener('click', handleUpdateUserInfo);
}
// 1. get으로 유저정보 가져옴
async function getUserInfo() {
  try {
    const result = await API.get('/api/users', `${uid}`);
    nameInputVal.value = result.userName;
    emailValue.innerText = result.email;
    sessionStorage.setItem('userName', result.userName);
    sessionStorage.setItem('userEmail', result.email);
    renderCategoryBar();
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// /api/users/:uid
// 2. 버튼 누를 시 patch

async function handleUpdateUserInfo(e) {
  e.preventDefault();
  const userName = nameInputVal.value;
  const password = newPasswordInputVal.value;
  const currentPassword = currentPasswordInputVal.value;

  // 수정 api요청
  try {
    const data = { userName, password, currentPassword };
    const result = await API.patch('/api/users', `${uid}`, data);
    console.log(result);
    alert('회원정보가 수정되었습니다!');

    // 수정 후에 input clear
    currentPasswordInputVal.value = '';
    newPasswordInputVal.value = '';
    newPasswordInputChkVal.value = '';
  } catch (err) {
    alert(err.message);
  }
}
