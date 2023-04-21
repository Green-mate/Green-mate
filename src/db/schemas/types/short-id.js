import { nanoid } from "nanoid";

// 6자리 random 문자열 생성 ex. "StGXR8"
const shortId = {
  type: String,
  default: () => {
    return nanoid(6);
  },
  require: true,
  index: true,
};

export { shortId };
