import { Router } from 'express';
import is from '@sindresorhus/is';
import { adminOnly, loginRequired } from '../middlewares';
import { categoryService } from '../services';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴

const categoryRouter = Router();

categoryRouter.get('/admin/categories', async (req, res, next) => {
  try {
    const categories = await categoryService.getCategorys();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});

categoryRouter.get(
  '/admin/categories/:cid',
  loginRequired,
  async (req, res, next) => {
    try {
      const cid = req.params.cid;
      const categoryData = await categoryService.getCategoryDataById(cid);

      res.status(200).json(categoryData);
    } catch (error) {
      next(error);
    }
  },
);

categoryRouter.post('/admin/categories', adminOnly, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요',
      );
    }

    const categoryName = req.body.categoryName;
    const newCategory = await categoryService.addCategory({
      categoryName,
    });
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
});

categoryRouter.put(
  '/admin/categories/:cid',
  adminOnly,
  async (req, res, next) => {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요',
        );
      }
      const cid = req.params.cid;
      const categoryName = req.body.categoryName;

      const toUpdate = {
        ...(categoryName && { categoryName }),
      };

      const updatedCategory = await categoryService.setCategory(cid, toUpdate);

      res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  },
);

categoryRouter.delete(
  '/admin/categories/:cid',
  loginRequired,
  async (req, res, next) => {
    try {
      const cid = req.params.cid;
      const deleteResult = await categoryService.deleteCategoryData(cid);

      res.status(200).json(deleteResult);
    } catch (error) {
      next(error);
    }
  },
);

export { categoryRouter };
