const addBtn = document.getElementById('addBtn');
const addContentDiv = document.getElementById('add-content-div');
const categoryListDiv = document.getElementById('category-list-div');

const cancleBtn = document.getElementById('cancleBtn');

addBtn.addEventListener('click', () => {
  addContentDiv.style.display = '';
  addBtn.style.display = 'none';
  cancleBtn.style.display = '';
});

cancleBtn.addEventListener('click', () => {
  addContentDiv.style.display = 'none';
  addBtn.style.display = '';
  cancleBtn.style.display = 'none';
});
