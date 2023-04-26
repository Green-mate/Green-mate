import moment from "moment-timezone";

export const krDate = () => {
  const m = moment().tz("Asia/Seoul");
  return m.format("YYYY-MM-DD HH:mm:ss");
};
