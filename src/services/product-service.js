import { categoryModel, productModel } from "../db";
/*
status(200) - 성공
해당되는 상품 목록을 객체리스트로 받아옵니다.
products = [
  {
    product_name,
    product_price,
    productImage,
    stock,
  },
  {…},
]
전체 또는 카테고리에 해당하는 상품 개수를 받아옵니다.
countProducts = 109 // 전체 상품 수: 109개

status(400) - 실패(DB에서 카테고리를 찾을 수 없는 경우)
{
"result": "error",
"reason": “카테고리가 존재하지 않습니다."
}

status(400) - 실패(페이지를 찾을 수 없는 경우)
{
"result": "error",
"reason": “해당 페이지가 존재하지 않습니다."
}
*/
class ProductService {
  constructor(categoryModel, productModel) {
    this.categoryModel = categoryModel;
    this.productModel = productModel;
  }
  // 주어진 데이터가 데이터베이스에 하나 이상 존재하는 경우에는 그 값을 반환하고, 아니면 null
  async getProduct(category) {
    const products = await this.productModel.exists({ category });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (products === null) {
      throw new Error("카테고리가 존재하지 않습니다.");
    } else {
      return products;
    }
  }
}

const productService = new ProductService(categoryModel, productModel);

export { productService };
