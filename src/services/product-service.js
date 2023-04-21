import { categoryModel, productModel } from "../db";

export class ProductService {
  // 전체(해당 카테고리) 상품 개수를 가져옴
  async getProductsCount(category) {
    const count = await productModel.countDocuments({ category }).exec();

    return count;
  }
  // 전체(해당 카테고리) 상품 조회
  // 주어진 데이터가 데이터베이스에 하나 이상 존재하는 경우에는 그 값을 반환하고, 아니면 null
  async getProducts(categoryName) {
    const category = await categoryModel.findOne({ categoryName }).exec();
    const products = await productModel.find({ category }).exec();

    if (category === null) {
      throw new Error("해당하는 카테고리가 없습니다.");
    }

    return products;
  }

  // 상품 상세 조회
  async getProductById(id) {
    const products = await productModel.findOne({ shortId: id }).exec();

    if (products === null) {
      throw new Error("해당하는 상품이 존재하지 않습니다.");
    }

    return products;
  }

  // 관리자페이지 상품 전체 조회
  async getAdminProducts() {
    const products = await productModel.find({}, { productImage: 0 }).exec();

    return products;
  }

  // 상품 추가
  async addProducts(productName, category, productPrice, productImage, stock) {
    const productNameDB = await productModel.findOne({ productName }).exec();
    if (productNameDB) {
      throw new Error("이미 존재하는 상품입니다.");
    } else {
      await productModel
        .create({
          productName,
          category,
          productPrice: Number(productPrice),
          productImage,
          stock: Number(stock),
        })
        .exec();
    }

    return "success";
  }

  // 상품 업데이트
  async updateProduct(item, updateObj) {
    const filter = { productName: item };

    const updateProduct = await productModel
      .findOneAndUpdate(filter, updateObj, { new: true })
      .exec();

    if (updateProduct === null) {
      throw new Error("해당 상품을 찾을 수 없어 수정할 수 없습니다.");
    }

    return "success";
  }

  // 상품 삭제
  async deleteProduct(item) {
    const productName = await productModel
      .findOne({ productName: item })
      .exec();

    if (productName === null) {
      throw new Error("해당 상품을 찾을 수 없어 삭제에 실패했습니다.");
    } else {
      const deleteProduct = await productModel
        .deleteOne({ productName })
        .exec();
    }

    return "success";
  }
}

const productService = new ProductService();

export { productService };
