import { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "categories",
  }
);

export { CategorySchema };
