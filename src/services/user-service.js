import { userModel, orderModel, productModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
    this.orderModel = orderModel;
    this.productModel = productModel;
  }

  // 회원가입
  async addUser(userInfo) {
    const { email, userName, password, role } = userInfo;
    const user = await this.userModel.findByEmail(email);
    if (user) {
      throw new Error(
        '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserInfo = { userName, email, password: hashedPassword, role };
    const createdNewUser = await this.userModel.create(newUserInfo);

    return createdNewUser;
  }

  // 로그인
  async getUserToken(loginInfo) {
    const { email, password } = loginInfo;

    // 우선 해당 이메일의 사용자 정보가  db에 존재하는지 확인
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new Error(
        '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.',
      );
    }

    if (user.role === 'disabled') {
      throw new Error(
        '해당 계정은 탈퇴처리된 계정입니다. 관리자에게 문의하세요.',
      );
    }
    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password; // db에 저장되어 있는 암호화된 비밀번호
    // 매개변수의 순서 중요 (1번째는 프론트가 보내온 비밀번호, 2번쨰는 db에 있떤 암호화된 비밀번호)
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash,
    );

    if (!isPasswordCorrect) {
      throw new Error(
        '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.',
      );
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);
    const userInfoWithUserToken = {};
    userInfoWithUserToken.token = token;
    userInfoWithUserToken.userId = user._id;
    userInfoWithUserToken.role = user.role;

    return userInfoWithUserToken;
  }

  //유저 정보 조회
  async getUser(userId) {
    const user = await this.userModel.findById(userId);
    return user;
  }

  // 유저정보 수정, 현재 비밀번호가 있어야 수정 가능함.
  async setUser(userInfoRequired, toUpdate) {
    const { userId, currentPassword } = userInfoRequired;

    // 우선 해당 id의 유저가 db에 있는지 확인
    let user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    if (!currentPassword) {
      throw new Error('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
    }

    //  사용자가 입력한 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash,
    );

    if (!isPasswordCorrect) {
      throw new Error(
        '현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.',
      );
    }

    // 이제 드디어 업데이트 시작
    // 비밀번호도 변경하는 경우에는, 회원가입 때처럼 해쉬화 해주어야 함.
    const { password } = toUpdate;

    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
    }

    // 업데이트 진행
    user = await this.userModel.update({
      userId,
      update: toUpdate,
    });

    return user;
  }

  async deleteUser(userId) {
    let user = await this.userModel.findById(userId);
    const currentRole = user.role;
    const updatedInfo = {};
    updatedInfo.role = 'disabled';

    if (currentRole === 'basic-user') {
      user = await this.userModel.update({ userId, update: updatedInfo });
    }
    if (currentRole === 'admin') {
      throw new Error('관리자는 본인의 관리자 계정을 삭제할 수 없습니다.');
    }

    return user;
  }

  // 유저가 좋아요한 상품 리스트 -> 마이페이지 조회시

  // async addLike(userId, productId) {
  //   // 해당 userId의 유저정보 조회
  //   const user = await this.userModel.findById(userId);
  //   if (!user) {
  //     throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
  //   }

  //   // 유저가 좋아요를 누른 상품 조회
  //   const likedProducts = user.likedProducts || [];

  //   // 이미 좋아요를 눌렀던 상품인지 확인
  //   if (likedProducts.includes(productId)) {
  //     throw new Error('이미 좋아요를 누른 상품입니다.');
  //   }

  //   // 좋아요 추가
  //   likedProducts.push(productId);

  //   // 해당 상품의 likeCount 증가
  //   const product = await this.productModel.findById(productId);
  //   if (!product) {
  //     throw new Error('상품 정보를 찾을 수 없습니다.');
  //   }
  //   product.likeCount = (product.likeCount || 0) + 1;
  //   await product.save();

  //   // 유저정보 업데이트
  //   user.likedProducts = likedProducts;
  //   await user.save();

  //   return { message: '좋아요 추가 완료' };
  // }
  async likeProduct(userId, productId) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new Error('게시물이 존재하지 않습니다.');
    }

    // 좋아요를 누른 게시물 목록에 이미 존재하는 경우에는, 중복 처리하지 않음.
    const likedProductIds = user.likedProducts.map((product) =>
      product.productId.toString(),
    );
    if (likedProductIds.includes(productId.toString())) {
      return user;
    }

    // 좋아요 추가
    user.likedProducts.push({ productId });
    await user.save();

    // 좋아요 개수 증가
    product.likes++;
    await product.save();

    return user;
  }

  async unlikeProduct(userId, productId) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new Error('게시물이 존재하지 않습니다.');
    }

    // 좋아요를 누른 게시물 목록에서 제거
    const likedProductIds = user.likedProducts.map((product) =>
      product.productId.toString(),
    );
    const index = likedProductIds.indexOf(productId.toString());
    if (index === -1) {
      // 이미 좋아요를 누르지 않은 게시물이면 중복 처리하지 않음.
      return user;
    }

    user.likedProducts.splice(index, 1);
    await user.save();

    // 좋아요 개수 감소
    product.likes--;
    await product.save();

    return user;
  }
}

const userService = new UserService(userModel);

export { userService };
