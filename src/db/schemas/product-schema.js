import { Schema } from "mongoose";
import { shortId } from "./types/short-id";

const ProductSchema = new Schema(
  {
    shortId, // 상품 id
    productName: {
      type: String,
      required: true,
      unique: true, // 상품명은 유일한 값으로 사용.
    },
    // categories 도큐먼트의 Object id를 product의 category 필드로 추가:
    // i. product Object id로 product 도큐먼트를 찾아서,
    // ii. 그 도큐먼트의 categoriesName에 새로 만든 category 도큐먼트의 Object id를 추가
    category: {
      type: [Schema.Types.ObjectId],
      ref: "categories",
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
  },
  {
    timestamps: true,
    collection: "products",
  }
);

export { ProductSchema };
