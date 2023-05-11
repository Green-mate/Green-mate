import { model } from 'mongoose';
import { UserSchema } from '../schemas/user-schema';

const User = model('User', UserSchema);

export class UserModel {
  //email로 찾기 기능 (회원가입시 이메일 중복 찾기 위해 만든것 )
  async findByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }
  //userId로 찾기 기능
  async findById(userId) {
    const user = await User.findOne({ _id: userId });
    return user;
  }

  //일반 유저의 회원 가입 기능
  async create(userInfo) {
    const createdNewUser = await User.create(userInfo);
    return createdNewUser;
  }

  // 관리자의 유저 전체 조회 기능
  async findAll() {
    const users = await User.find({});
    return users;
  }

  //userId로 찾아온 유저 정보를 수정하는 기능.
  async update({ userId, update }) {
    const filter = { _id: userId };
    const option = { returnOriginal: false }; //업데이트된 도큐먼트를 반환해줌.

    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }

  // 상품 좋아요 추가 기능
  async likeProduct(userId, productId) {
    const user = await User.findById(userId);

    if (!user.likedProducts.includes(productId)) {
      user.likedProducts.push(productId);
      await user.save();
    }

    return user;
  }

  // 상품 좋아요 삭제 기능
  async unlikeProduct(userId, productId) {
    const user = await User.findById(userId);

    if (user.likedProducts.includes(productId)) {
      user.likedProducts = user.likedProducts.filter((id) => id !== productId);
      await user.save();
    }

    return user;
  }

  // 유저가 좋아요한 상품 리스트 반환 기능 -> 마이페이지에서 사용할 것임
  async getUserLikedProducts(userId) {
    const user = await User.findById(userId).populate('likedProducts');
    const likedProducts = user.likedProducts;
    return likedProducts;
  }
}
const userModel = new UserModel();

export { userModel };
