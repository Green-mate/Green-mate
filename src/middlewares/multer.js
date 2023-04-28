import express from 'express';
import multer from 'multer';

const path = require('path');

const fileFilter = (req, file, next) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    next(null, true);
  } else {
    req.fileValidationError = 'jpg,jpeg,png,gif,webp 파일만 업로드 가능합니다.';
    next(null, false);
  }
};

const productImageUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, done) => {
      done(null, 'src/views/dist/product-images');
    },
    filename: (req, file, done) => {
      const ext = path.extname(file.originalname);

      const fileName = path.basename(file.originalname, ext) + ext;
      done(null, fileName);
    },
  }),
  fileFilter,
  limits: { fileSize: 30 * 1024 * 1024 },
});

export { productImageUpload };
