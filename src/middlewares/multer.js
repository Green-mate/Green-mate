import express from 'express';
import multer from 'multer';

const productImageUpload = multer({
  dest: __dirname + '../../views/dist/product-images/',
});

export { productImageUpload };
