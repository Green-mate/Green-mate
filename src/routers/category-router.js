import { Router } from 'express';
import { Category } from '../db';
import is from '@sindresorhus/is';
import { validateCategory } from '../middlewares';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴

const categoryRouter = Router();
const { Types } = require('mongoose');

categoryRouter.get('/admin/categories', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

categoryRouter.get('/admin/categories/:cid', async (req, res) => {
  const { cid } = req.params;
  const category = await Category.findById(cid);
  if (!category) {
    res.status(400).json({ error: 'Category not found' });
  } else {
    res.json(category);
  }
});

categoryRouter.post('/admin/categories', validateCategory, async (req, res) => {
  const { categoryName } = req.body;
  const category = new Category({ categoryName });
  await category.save();
  res.json(category);
});

categoryRouter.put('/admin/categories/:cid', async (req, res) => {
  const { cid } = req.params;
  const { categoryName } = req.body;
  const validId = Types.ObjectId(cid); //유효한 ObjectID로 형변환
  const category = await Category.findByIdAndUpdate(
    validId,
    { categoryName },
    {
      new: true,
    },
  );
  res.json(category);
});

categoryRouter.delete('/admin/categories/:cid', async (req, res) => {
  const { cid } = req.params;
  await Category.findByIdAndDelete(cid);
  res.sendStatus(204);
});

export { categoryRouter };
