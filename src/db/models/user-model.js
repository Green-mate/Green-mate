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

  async delete(userId) {
    const filter = { _id: userId };
    const update = { role: 'disabled' };
    const option = { returnOriginal: false };

    const deletedUser = await User.findOneAndUpdate(filter, update, option);
    return deletedUser;
  }
}

const userModel = new UserModel();

export { userModel };
