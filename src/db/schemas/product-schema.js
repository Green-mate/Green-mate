import { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true, // 상품명을 primary key로써 사용.
    },
    category: {
      // type: [Schema.Types.ObjectId],
      // ref: "categories",
      type: [String],
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
