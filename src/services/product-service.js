<<<<<<< HEAD
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
    console.log(`count: ${count}`);
    return count;
  }

  // 카테고리 상품 개수를 가져옴
  async getProductsCount(category) {
    const count = await this.productModel.countDocumentsByCategory(category);
    if (count === null) {
      throw new Error("상품 개수를 불러올 수 없습니다.");
    }
    console.log(`count: ${count}`);
    return count;
  }

  // 전체 상품 조회
  async getProductsAll() {
    const products = await this.productModel.findAll();

    if (products === null) {
      throw new Error("상품 목록을 불러올 수 없습니다.");
    }
    console.log(
      "🚀 ~ file: product-service.js:38 ~ ProductService ~ getProducts ~ products:",
      products
    );
    return products;
  }

  // 카테고리별 상품 조회
  async getProducts(category) {
    const products = await this.productModel.findAllByCategory(category);
    console.log(
      "🚀 ~ file: product-service.js:36 ~ ProductService ~ getProducts ~ products:",
      products
    );

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
    console.log(newProduct);
    return "success";
  }

  // 상품 업데이트
  async updateProduct(item, updateObj) {
    const updateProduct = await this.productModel.update(item, updateObj);

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
=======
// import { categoryModel, Product } from "../db"; // Product는 Product model임.
// /*
// status(200) - 성공
// 해당되는 상품 목록을 객체리스트로 받아옵니다.
// products = [
//   {
//     product_name,
//     product_price,
//     productImage,
//     stock,
//   },
//   {…},
// ]
// 전체 또는 카테고리에 해당하는 상품 개수를 받아옵니다.
// countProducts = 109 // 전체 상품 수: 109개

// status(400) - 실패(DB에서 카테고리를 찾을 수 없는 경우)
// {
// "result": "error",
// "reason": “카테고리가 존재하지 않습니다."
// }

// status(400) - 실패(페이지를 찾을 수 없는 경우)
// {
// "result": "error",
// "reason": “해당 페이지가 존재하지 않습니다."
// }
// */
// class ProductService {
//   constructor(categoryModel, Product) {
//     this.categoryModel = categoryModel;
//     this.productModel = Product;
//   }
//   // 주어진 데이터가 데이터베이스에 하나 이상 존재하는 경우에는 그 값을 반환하고, 아니면 null
//   async getProduct(category) {
//     const products = await this.Product.exists({ category });

//     // db에서 찾지 못한 경우, 에러 메시지 반환
//     if (products === null) {
//       throw new Error("카테고리가 존재하지 않습니다.");
//     } else {
//       return products;
//     }
//   }
// }

// const productService = new ProductService(categoryModel, Product);
>>>>>>> d6046cb0682f3abe94adb0617ea9bc4f2b86f354

// export { productService };
