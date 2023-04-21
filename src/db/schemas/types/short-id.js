import { nanoid } from "nanoid";

const shortId = {
  type: String,
  default: () => {
    return nanoid(6);
  },
  require: true,
  index: true,
};

export { shortId };
