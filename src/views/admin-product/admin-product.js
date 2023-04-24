const productListDiv = document.getElementById('product-list-div');
const addBtn = document.getElementById('addBtn');
const cancleBtn = document.getElementById('cancleBtn');
const registerProductForm = document.getElementById('register-product-form');

const thumbnailInputUpload = document.getElementById('thumbnail-input');
const upload = document.getElementById('upload');

function getImageFiles(e) {
  const files = e.currentTarget.files;
  console.log(typeof files, files);
}

addBtn.addEventListener('click', () => {
  productListDiv.style.display = 'none';
  addBtn.style.display = 'none';
  cancleBtn.style.display = '';
  registerProductForm.style.display = '';
});

cancleBtn.addEventListener('click', () => {
  productListDiv.style.display = 'block';
  addBtn.style.display = '';
  cancleBtn.style.display = 'none';
  registerProductForm.style.display = 'none';
});

upload.addEventListener('click', () => thumbnailInputUpload.click());
thumbnailInputUpload.addEventListener('change', getImageFiles);

thumbnailInputUpload.addEventListener('change', () => {
  if (thumbnailInputUpload.files && thumbnailInputUpload.files[0]) {
    const reader = new FileReader();

    reader.onload = (e) => {
      upload.src = e.target.result;
    };

    reader.readAsDataURL(thumbnailInputUpload.files[0]);
  }
});
