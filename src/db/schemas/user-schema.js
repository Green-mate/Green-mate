import { Schema } from "mongoose";

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
      default: "basic-user", // admin, disabled
    },
    orderList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },
    ],
    createdDate: {
      type: String,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export { UserSchema };
