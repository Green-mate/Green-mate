import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'dotenv/config';
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

  //구글 로그인
  async getUserTokenByGoogle(profile) {
    try {
      const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
      const exUser = await this.userModel.findByEmail(
        // 구글 플랫폼에서 로그인 했고 & snsId필드에 구글 아이디가 일치할경우
        profile.emails[0].value.toString(),
      );
      // 이미 가입된 구글 프로필이면 성공
      if (exUser) {
        if (exUser.role === 'disabled') {
          throw new Error(
            '해당 계정은 탈퇴처리된 계정입니다. 관리자에게 문의하세요.',
          );
        }
        const userInfoWithUserToken = {};
        const token = jwt.sign(
          { userId: exUser._id, role: exUser.role },
          secretKey,
        );
        userInfoWithUserToken.token = token;
        userInfoWithUserToken.userId = exUser._id;
        userInfoWithUserToken.role = exUser.role;
        console.log('기 회원가입 로그인 토큰 : ', userInfoWithUserToken);

        return userInfoWithUserToken;
      } else {
        // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
        const newUser = await this.userModel.create({
          email: profile.emails[0].value.toString(),
          userName: profile.displayName,
          provider: 'google',
        });
        const token = jwt.sign(
          { userId: newUser._id, role: newUser.role },
          secretKey,
        );
        const userInfoWithUserToken = {};
        userInfoWithUserToken.token = token;
        userInfoWithUserToken.userId = newUser._id;
        userInfoWithUserToken.role = newUser.role;
        console.log('회원가입 후 로그인 토큰 : ', userInfoWithUserToken);
        return userInfoWithUserToken;
      }
    } catch (error) {
      throw error;
    }
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

  async toggleUserLikedProducts(userId, productId) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const product = await this.productModel.findByShortId(productId);
    if (!product) {
      throw new Error('게시물이 존재하지 않습니다.');
    }

    const newUser = await this.userModel.userLikedProducts(userId, productId);

    return newUser;
  }

  // 좋아요한 상품 리스트 리턴
  async getUserLikedProductList(userId) {
    const result = {};
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const likedProducts = await this.userModel.getUserLikedProducts(userId);
    if (likedProducts.length === 0) {
      throw new Error('찜한 상품이 없습니다.');
    }

    result.likedProductList = likedProducts;
    return result;
  }
}

const userService = new UserService(userModel);

export { userService };
