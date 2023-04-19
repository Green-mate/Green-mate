import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const Category = model('Category', CategorySchema);

export { Category };
