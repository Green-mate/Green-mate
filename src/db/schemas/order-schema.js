//order-schema

import { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    recipient: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //상품 리스트 (상품 id와 수량을 프론트엔드에서 받아올 예정)
    productList: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingStatus: {
      type: String,
      default: "배송전", //배송전, 배송중, 배송 완료
    },
    zipCode: {
      type: String,
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
      required: false,
    },
    shippingMessage: {
      type: String,
      required: false,
    },
    createdDate: {
      type: String,
      default: Date.now,
    },
  },
  {
    timestamps: true, //주문 날짜는 타임스태프에서 추출하기
    collection: "orders",
  }
);

export { OrderSchema };
