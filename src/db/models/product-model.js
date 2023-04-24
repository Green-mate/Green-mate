import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';

const Product = model('products', ProductSchema);

export class ProductModel {
  async countDocumentsAll() {
    const count = await Product.countDocuments({});
    return count;
  }
  async countDocumentsByCategory(category) {
    const count = await Product.countDocuments({ category });
    return count;
  }

  async findAll() {
    const products = await Product.find({});
    return products;
  }

  async findAllByCategory(category) {
    const products = await Product.find({ category });
    return products;
  }

  async findOneByCategory(category) {
    const products = await Product.findOne({ category });
    return products;
  }

  // shortId를 이용해서 상품을 찾아옵니다.
  async findByShortId(shortId) {
    const product = await Product.findOne({ shortId });
    return product;
  }

  async findById(productId) {
    const product = await Product.find({ _id: productId });
    return product;
  }

  async findByProductName(productName) {
    const products = await Product.findOne({ productName });
    return products;
  }

  async create(productObj) {
    const newProducts = await Product.create(productObj);
    return newProducts;
  }

  async update({ product, updateObj }) {
    const filter = { productName: product };
    const option = { returnOriginal: false };
    console.log(product);
    const updatedProduct = await Product.findOneAndUpdate(
      filter,
      updateObj,
      option,
    );
    console.log(
      "🚀 ~ file: product-model.js:55 ~ ProductModel ~ update ~ updatedProduct:",
      filter,
      updateObj,
      updatedProduct
    );
    return updatedProduct;
  }

  async updateById({ productId, count }) {
    const filter = { _id: productId };
    const option = { returnOriginal: false };
    const updatedProduct = await Product.findOneAndUpdate(
      filter,
      { $inc: { stock: count } },
      option,
    );

    return updatedProduct;
  }

  async updateStock(shortId, stock, count) {
    const updatedStock = await Product.updateOne(
      { shortId, stock },
      { $inc: { stock: count } },
    );

    return updatedStock;
  }

  async delete(item) {
    const deletedProducts = await Product.deleteOne({ productName: item });
    return deletedProducts;
  }
}

const productModel = new ProductModel();

export { productModel };
