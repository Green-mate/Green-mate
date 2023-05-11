// import { Router } from 'express';
// import { loginRequired } from '../middlewares';
// import {
//   getUserLikedProducts,
//   getLikedProducts,
// } from '../services/like-service';

// import { UserModel } from '../db';
// import { productService } from '../services/product-service';

// const router = Router();

// router.post('/like/:uid/:shortId', loginRequired, async (req, res, next) => {
//   try {
//     const shortId = req.params.shortId;
//     const userId = req.params.uid;

//     const user = await this.UserModel.findById(userId);
//     const product = await productService.getProductById(shortId);

//     if (!product) {
//       return res.status(404).json({ message: '상품이 존재하지 않습니다.' });
//     }

//     if (user.likedProducts.includes(shortId)) {
//       return res.status(400).json({ message: '이미 좋아요 한 상품입니다' });
//     }

//     user.likedProducts.push(product);
//     await user.save();

//     product.likes += 1;
//     await product.save();

//     res.json({ message: '좋아요 완료!' });
//   } catch (err) {
//     next(err);
//   }
// });

// router.delete('/like/:shortId', loginRequired, async (req, res, next) => {
//   try {
//     const shortId = req.params.shortId;
//     const user = req.body.userId;
//     const product = await getProductById(shortId);

//     if (!product) {
//       return res.status(404).json({ message: '상품이 존재하지 않습니다.' });
//     }

//     if (!user.likedProducts.includes(shortId)) {
//       return res
//         .status(400)
//         .json({ message: '좋아요를 누르지 않은 상품입니다.' });
//     }

//     user.likedProducts = user.likedProducts.filter((id) => id !== shortId);
//     await user.save();

//     product.likes -= 1;
//     await product.save();

//     res.json({ message: '좋아요 취소 완@!' });
//   } catch (err) {
//     next(err);
//   }
// });

// export default router;
