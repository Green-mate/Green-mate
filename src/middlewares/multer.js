import express from 'express';
import multer from 'multer';

const productImageUpload = multer({
  dest: __dirname + '../dist/product-images/' + '.jpg',
});

export { productImageUpload };
