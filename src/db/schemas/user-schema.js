import { Schema } from 'mongoose';
// import { shortId } from "./types/short-Id";
//(엘리스에서 short-ID를 계속 사용했는데, 사용할지는 생각 필요해보여요)

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'basic-user', // admin, disabled
    },
    orderList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

export { UserSchema };
