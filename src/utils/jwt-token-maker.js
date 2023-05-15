import jwt from 'jsonwebtoken';
import 'dotenv/config';

function makeJwtToken(user) {
  const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
  const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);
  const userInfoWithUserToken = {};
  userInfoWithUserToken.token = token;
  userInfoWithUserToken.userId = user._id;
  userInfoWithUserToken.role = user.role;

  return userInfoWithUserToken;
}

export { makeJwtToken };
