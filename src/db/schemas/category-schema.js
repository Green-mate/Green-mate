import { Schema } from 'mongoose';

const CategorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    createdDate: {
      type: String,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'categories',
  },
);

export { CategorySchema };
