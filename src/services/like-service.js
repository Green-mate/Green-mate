// import { ProductModel } from '../db';
// import { UserModel } from '../db';

// exports.getUserLikedProducts = async (userId) => {
//   const user = await UserModel.findById(userId).populate('likedProducts');
//   const likedProducts = user.likedProducts;
//   return likedProducts;
// };

// exports.getLikedProducts = async (user) => {
//   const likedProducts = await ProductModel.find({
//     _id: { $in: user.likedProducts },
//   });
//   return likedProducts;
// };
// //
