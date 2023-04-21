import { Router } from 'express';
import is from '@sindresorhus/is';
import { loginRequired } from '../middlewares';
import { userService } from '../services';

const userRouter = Router();

userRouter.post('/users/join', async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요',
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    const { userName, email, password, role } = req.body;

    // 위 데이터를 유저 db에 추가하기
    const newUser = await userService.addUser({
      userName,
      email,
      password,
      role,
    });
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// 로그인 api (아래는 /login 이지만, 실제로는 /api/users/login로 요청해야 함.)
userRouter.post('/users/login', async function (req, res, next) {
  try {
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
  } catch (error) {
    next(error);
  }
});

// uid에 해당하는 유저 개인의 목록을 가져옴 (단일)
userRouter.get('/users/:uid', loginRequired, async function (req, res, next) {
  try {
    const userId = req.params.uid;
    const user = await userService.getUser(userId);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// 사용자 정보 수정
userRouter.patch('/users/:uid', loginRequired, async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
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
  } catch (error) {
    next(error);
  }
});

//유저 role disabled로 변경 (회원탈퇴)
userRouter.patch(
  '/users/delete/:uid',
  loginRequired,
  async (req, res, next) => {
    try {
      const userId = req.params.uid;
      const deletedUserInfo = await userService.deleteUser(userId);
      res.status(200).json(deletedUserInfo);
    } catch (error) {
      next(error);
    }
  },
);

export { userRouter };
