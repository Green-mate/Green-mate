import { productModel } from '../db';

export class ProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }
  // 전체 상품 개수를 가져옴
  async getProductsCountAll() {
    const count = await this.productModel.countDocumentsAll();
    if (!count) {
      throw new Error('상품 개수를 불러올 수 없습니다.');
    }
    return count;
  }

  // 카테고리 상품 개수를 가져옴
  async getProductsCount(category) {
    const count = await this.productModel.countDocumentsByCategory(category);
    if (!count) {
      throw new Error('상품 개수를 불러올 수 없습니다.');
    }
    return count;
  }

  // 전체 상품 조회
  async getProductsAll() {
    const products = await this.productModel.findAll();
    if (!products) {
      throw new Error('상품 목록을 불러올 수 없습니다.');
    }
    return products;
  }

  // 카테고리별 상품 조회
  async getProducts(category) {
    const products = await this.productModel.findAllByCategory(category);
    if (products === null) {
      throw new Error('상품 목록을 불러올 수 없습니다.');
    }
    return products;
  }

  // 상품 상세 조회
  async getProductById(shortId) {
    const products = await this.productModel.findByShortId(shortId);
    if (!products) {
      throw new Error('해당하는 상품이 존재하지 않습니다.');
    }
    return products;
  }

  // 상품 이름으로 조회
  async getProductByName(item) {
    const products = await this.productModel.findByProductName(item);
    if (!products) {
      throw new Error('해당하는 상품이 존재하지 않습니다.');
    }
    return products;
  }

  // 관리자페이지 상품 전체 조회
  async getAdminProducts() {
    const products = await this.productModel.findAll({});
    if (!products) {
      throw new Error('해당하는 상품이 존재하지 않습니다.');
    }
    return products;
  }

  // 상품 추가
  async addProducts(productObj) {
    const { productName } = productObj;
    const productNameInDB = await this.productModel.findByProductName(
      productName,
    );
    if (productNameInDB) {
      throw new Error('이미 존재하는 상품입니다.');
    }
    const newProduct = await this.productModel.create(productObj);
    return newProduct;
  }

  // 상품 업데이트
  async updateProduct(item, updateObj) {
    const product = item;
    const updateProduct = await this.productModel.update({
      product,
      updateObj,
    });
    if (!updateProduct) {
      throw new Error('해당 상품을 찾을 수 없어 수정할 수 없습니다.');
    }
    return updateProduct;
  }

  // 상품 삭제
  async deleteProduct(item) {
    const deleteProduct = await this.productModel.delete(item);
    if (!deleteProduct) {
      throw new Error('해당 상품을 찾을 수 없어 삭제에 실패했습니다.');
    }
    return deleteProduct;
  }

  // 좋아요 토글 기능 -> 추가, 삭제 한꺼번에 하는 함수
  async toggleLike(productId, userId) {
    const product = await this.productModel.findById(productId);
    const likedUsers = product.likedUsers?.map((userId) => userId.toString());

    // 이미 배열에 있으면 삭제하고, 해당 id를 제외한 배열로 업데이트
    if (likedUsers?.includes(userId)) {
      product.likes--;
      product.likedUsers = product.likedUsers.filter(
        (user) => user.toString() !== userId,
      );
    } else {
      product.likes++;
      product.likedUsers.push(userId);
    }

    await product.save();
    return product;
  }
}

const productService = new ProductService(productModel);

export { productService };
