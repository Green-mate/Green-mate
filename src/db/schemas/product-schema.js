import { Schema } from "mongoose";
import { shortId } from "./types/short-id";

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
      min: 0,
      default: 10,
      required: true,
    },
    createdDate: {
      type: String, // 꼭 스트링으로 설정. Date로 하면 에러남.
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

export { ProductSchema };
