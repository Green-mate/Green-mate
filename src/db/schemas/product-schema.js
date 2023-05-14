import { Schema } from 'mongoose';
import { shortId } from './types/short-id';

const ProductSchema = new Schema(
  {
    shortId, // 상품 id
    productName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    stock: {
      //0이면 주문 불가능
      type: Number,
      default: 10,
      required: true,
    },
    // 상품 하나에 대한 전체 좋아요 수
    likes: {
      type: Number,
      default: 0,
    },
    // 특정 유저가 특정 상품을 좋아요 눌렀는 지에 대한 상태
    // 상품 하나에 대한 좋아요를 누른 유저 id
    // 전체 상품 조회 시 리스트에 해당 유저의 id값이 있다면, 좋아요를 이미 했다는 상태값으로 사용 가능.
    likedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdDate: {
      type: String, // 꼭 스트링으로 설정. Date로 하면 에러남.
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'products',
  },
);

export { ProductSchema };
