import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const Category = model('categorys', CategorySchema);

export class CategoryModel {
  async findByTitle(categoryName) {
    const category = await Category.findOne({ categoryName });
    return category;
  }

  async findById(categoryId) {
    const category = await Category.findOne({ _id: categoryId });
    return category;
  }

  async create(categoryInfo) {
    const createdNewCategory = await Category.create(categoryInfo);
    return createdNewCategory;
  }

  async findAll() {
    const categorys = await Category.find({});
    return categorys;
  }

  async update({ categoryId, update }) {
    const filter = { _id: categoryId };
    const option = { returnOriginal: false };

    const updatedCategory = await Category.findOneAndUpdate(
      filter,
      update,
      option,
    );
    return updatedCategory;
  }

  async deleteById(categoryId) {
    const result = await Category.deleteOne({ _id: categoryId });
    return result;
  }
}

const categoryModel = new CategoryModel();

export { categoryModel };
