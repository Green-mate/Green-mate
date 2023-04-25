import { productModel } from "../db";

export class ProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }
  // 전체 상품 개수를 가져옴
  async getProductsCountAll() {
    const count = await this.productModel.countDocumentsAll();
    if (count === null) {
      throw new Error("상품 개수를 불러올 수 없습니다.");
    }
    return count;
  }

  // 카테고리 상품 개수를 가져옴
  async getProductsCount(category) {
    const count = await this.productModel.countDocumentsByCategory(category);
    if (count === null) {
      throw new Error("상품 개수를 불러올 수 없습니다.");
    }
    return count;
  }

  // 전체 상품 조회
  async getProductsAll() {
    const products = await this.productModel.findAll();

    if (products === null) {
      throw new Error("상품 목록을 불러올 수 없습니다.");
    }
    return products;
  }

  // 카테고리별 상품 조회
  async getProducts(category) {
    const products = await this.productModel.findAllByCategory(category);

    if (products === null) {
      throw new Error("상품 목록을 불러올 수 없습니다.");
    }

    return products;
  }

  // 상품 상세 조회
  async getProductById(shortId) {
    const products = await this.productModel.findByShortId(shortId);

    if (products === null) {
      throw new Error("해당하는 상품이 존재하지 않습니다.");
    }

    return products;
  }

  // 관리자페이지 상품 전체 조회
  async getAdminProducts() {
    const products = await this.productModel.findAll({}, { productImage: 0 });

    return products;
  }

  // 상품 추가
  async addProducts(productObj) {
    const { productName } = productObj;
    const productNameDB = await this.productModel.findByProductName(
      productName
    );
    if (productNameDB) {
      throw new Error("이미 존재하는 상품입니다.");
    }

    const newProduct = await this.productModel.create(productObj);
    console.log(`추가한 상품: ${newProduct}`);
    return "success";
  }

  // 상품 업데이트
  async updateProduct(item, updateObj) {
    const product = item;
    const updateProduct = await this.productModel.update({
      product,
      updateObj,
    });

    if (updateProduct === null) {
      throw new Error("해당 상품을 찾을 수 없어 수정할 수 없습니다.");
    }

    console.log(`수정된 데이터: ${updateProduct}`);

    return "success";
  }

  // 상품 삭제
  async deleteProduct(item) {
    const deleteProduct = await this.productModel.delete(item);

    if (deleteProduct === null) {
      throw new Error("해당 상품을 찾을 수 없어 삭제에 실패했습니다.");
    }

    return "success";
  }
}

const productService = new ProductService(productModel);

export { productService };
