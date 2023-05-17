import { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
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
        required: true,
      },
    ],
    // User 스키마에 좋아하는 상품 목록을 나타내는 likedProducts 필드를 추가
    // 마이페이지에서의 좋아요한 상품 조회 시, 해당 id값을 가진 상품들에 대한 데이터를 보내줌
    // UserModel이 참조하는 ProductModel의 id를 저장하는 배열임
    likedProducts: [{ type: String, ref: 'products' }],
    createdDate: {
      type: String,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

export { UserSchema };
