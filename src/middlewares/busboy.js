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
