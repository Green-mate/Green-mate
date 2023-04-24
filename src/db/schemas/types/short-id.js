import { nanoid } from "nanoid";

const shortId = {
  type: String,
  default: () => {
    return nanoid(6); // 6자리 random 문자열 생성 ex. "StGXR8"
  },
  require: true,
  unique: true,
  index: true,
};

export { shortId };
