import { Router } from 'express';
import is from '@sindresorhus/is';
import { errorHandler, loginRequired, asyncHandler } from '../middlewares';
import { userService } from '../services';

const userRouter = Router();

userRouter.post(
  '/users/join',
  asyncHandler(async (req, res, next) => {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요',
      );
    }
    const { userName, email, password, role } = req.body;
    const newUser = await userService.addUser({
      userName,
      email,
      password,
      role,
    });
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newUser);
  }),
);

// 로그인 api (아래는 /login 이지만, 실제로는 /api/users/login로 요청해야 함.)
userRouter.post(
  '/users/login',
  asyncHandler(async function (req, res) {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요',
      );
    }

    const { email, password } = req.body;
    // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
    const userInfoWithUserToken = await userService.getUserToken({
      email,
      password,
    });
    // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
    res.status(200).json(userInfoWithUserToken);
  }),
);

// uid에 해당하는 유저 개인의 목록을 가져옴 (단일)
userRouter.get(
  '/users/:uid',
  loginRequired,
  asyncHandler(async function (req, res, next) {
    const userId = req.params.uid;
    const user = await userService.getUser(userId);

    res.status(200).json(user);
  }),
);

// 사용자 정보 수정
userRouter.patch(
  '/users/:uid',
  loginRequired,
  asyncHandler(async function (req, res, next) {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요',
      );
    }

    const userId = req.params.uid;
    const { userName, password, currentPassword } = req.body;
    const userInfoRequired = { userId, currentPassword };

    const toUpdate = {};

    if (userName) {
      toUpdate.userName = userName;
    }
    if (password) {
      toUpdate.password = password;
    }

    // 사용자 정보를 업데이트함.
    const updatedUserInfo = await userService.setUser(
      userInfoRequired,
      toUpdate,
    );

    res.status(200).json(updatedUserInfo);
  }),
);

//유저 role disabled로 변경 (회원탈퇴)
userRouter.patch(
  '/users/delete/:uid',
  loginRequired,
  asyncHandler(async (req, res, next) => {
    const userId = req.params.uid;
    const deletedUserInfo = await userService.deleteUser(userId);
    res.status(200).json(deletedUserInfo);
  }),
);

export { userRouter };
