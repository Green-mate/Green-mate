import { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true, // 상품명은 유일한 값으로 사용.
    },
    category: {
      type: [Schema.Types.ObjectId],
      ref: "categories",
      // 테스트용 임시타임 지정.
      // type: [String],
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
