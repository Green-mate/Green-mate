import is from "@sindresorhus/is";
import { Router } from "express";
import { adminOnly } from "../middlewares";
import { productService } from "../services";

const productRouter = Router();

// 상품 전체 조회: /api/products?category=all&page=1&perPage=9
//상품 카테고리별 조회: /api/products?category=분재&page=1&perPage=9
productRouter.get("/products", async (req, res, next) => {
  try {
    const category = req.query.category;
    // page(현재 페이지 number), perPage(한 페이지에 보여줄 페이지 수)
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 9);

    // total, products 를 Promise.all 을 사용해 동시에 호출
    // 디스트럭트: [total, products] = [전체 게시글 수, 보여줄 게시글들]
    const [total, products] = await Promise.all([
      productModel.getProductsCount(category), // 전체 상품 개수를 가져옴
      // 페이지네이션
      productService
        .getProduct(category) // 전체 상품을 가져와서,
        .sort({ createdAt: -1 }) // 먼저 게시글을 최신 순으로 정렬하고,
        .skip(perPage * (page - 1)) // 현재 보여지는 상품은 건너뛰고,
        .limit(perPage), // 상품을 9개까지 보여줌.
    ]);
    const totalPage = Math.ceil(total / perPage);

    res.status(200).json({
      total,
      page,
      perPage,
      totalPage,
      products,
    });
  } catch (error) {
    next(error);
  }
});

// 상품 상세 조회: /api/products/:pid
productRouter.get("/products/:pid", async (req, res, next) => {
  try {
    const pid = req.params.pid;
    const products = await productModel.getProductById(pid);

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// 관리자 상품관리 페이지 상품목록 조회: /api/admin/products
productRouter.get("/admin/products", adminOnly, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type이 application/json으로 설정되지 않았습니다."
      );
    }

    const products = await productModel.getAdminProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// 관리자 상품 추가: /api/admin/products
productRouter.post("/admin/products", adminOnly, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type이 application/json으로 설정되지 않았습니다."
      );
    }

    const { productName, category, productPrice, productImage, stock } =
      req.body;

    const result = await productModel.addProducts(
      productName,
      category,
      productPrice,
      productImage,
      stock
    );

    res.status(201).json({
      result,
      reason: "상품이 추가되었습니다.",
    });
  } catch (error) {
    next(error);
  }
});

// 관리자 상품 수정: /api/admin/products?item=상품명
productRouter.patch("/admin/products", adminOnly, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type이 application/json으로 설정되지 않았습니다."
      );
    }

    const item = req.query.item;
    const { productName, category, productPrice, productImage, stock } =
      req.body;

    const updateObj = {
      productName,
      category,
      productPrice,
      productImage,
      stock,
    };

    const result = await productModel.updateProduct(item, updateObj);

    res.status(200).json({
      result,
      reason: "상품이 수정되었습니다.",
    });
  } catch (error) {
    next(error);
  }
});

// 관리자 상품 삭제: /api/admin/products?item=상품명
productRouter.delete("/admin/products", adminOnly, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type이 application/json으로 설정되지 않았습니다."
      );
    }

    const item = req.query.item;
    const deleteProduct = await productModel.deleteProduct(item);

    res.status(200).json({
      result,
      reason: "상품이 삭제되었습니다.",
    });
  } catch (error) {
    next(error);
  }
});

export { productRouter };
