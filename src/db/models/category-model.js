import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const Category = model('Categorys', CategorySchema);

export class CategoryModel {}

const CategoryModel = new CategoryModel();

export { CategoryModel };
