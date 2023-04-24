import is from "@sindresorhus/is";
import { Router } from "express";
import { adminOnly } from "../middlewares";
import { productService } from "../services";

const productRouter = Router();

// 상품 전체 조회: /api/products?page=1&perPage=9
productRouter.get("/products", async (req, res, next) => {
  try {
    // page(현재 페이지 number), perPage(한 페이지에 보여줄 페이지 수)
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 9);

    // 페이지네이션
    // total: 전체(카테고리) 상품 개수, products: 보여줄 게시글들
    const total = await productService.getProductsCountAll();
    // 전체 상품을 가져와서, 먼저 게시글을 최신 순으로 정렬하고, 현재 보여지는 상품은 건너뛰고, 상품을 9개까지 보여줌.
    const products = await productService.getProductsAll();
    //.sort({ createdAt: -1 })
    //.skip(perPage * (page - 1))
    //.limit(perPage);

    const totalPage = Math.ceil(total / perPage);

    res.status(200).json({
      //total,
      //page,
      //perPage,
      //totalPage,
      products,
    });
  } catch (error) {
    next(error);
  }
});

//상품 카테고리별 조회: /api/products/categories?덩굴성&page=1&perPage=9
productRouter.get("/products/categories", async (req, res, next) => {
  try {
    const category = req.query.category;

    // page(현재 페이지 number), perPage(한 페이지에 보여줄 페이지 수)
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 9);

    // 페이지네이션
    // total: 전체(카테고리) 상품 개수, products: 보여줄 게시글들
    const total = await productService.getProductsCount(category);
    // 전체 상품을 가져와서, 먼저 게시글을 최신 순으로 정렬하고, 현재 보여지는 상품은 건너뛰고, 상품을 9개까지 보여줌.
    const products = await productService.getProducts(category);
    //.sort({ createdAt: -1 })
    //.skip(perPage * (page - 1))
    //.limit(perPage);

    const totalPage = Math.ceil(total / perPage);

    res.status(200).json({
      //total,
      //page,
      //perPage,
      //totalPage,
      products,
    });
  } catch (error) {
    next(error);
  }
});

// 상품 상세 조회: /api/products/:shortId
productRouter.get("/products/:shortId", async (req, res, next) => {
  try {
    const shortId = req.params.shortId;
    const products = await productService.getProductById(shortId);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// 관리자 상품관리 페이지 상품목록 조회: /api/admin/products
productRouter.get("/admin/products", adminOnly, async (req, res, next) => {
  try {
    const products = await productService.getAdminProducts();

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// // 관리자 상품 추가: /api/admin/products
productRouter.post("/admin/products", adminOnly, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type이 application/json으로 설정되지 않았습니다."
      );
    }

    const { productName, category, productPrice, productImage, stock } =
      req.body;

    const productObj = {
      productName,
      category,
      productPrice: Number(productPrice),
      productImage,
      stock: Number(stock),
    };

    const result = await productService.addProducts(productObj);

    res.status(201).json({
      result,
      reason: "상품이 추가되었습니다.",
    });
  } catch (error) {
    next(error);
  }
});

// // 관리자 상품 수정: /api/admin/products?item
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
      productPrice: Number(productPrice),
      productImage,
      stock: Number(stock),
    };
    console.log(item);
    const result = await productService.updateProduct(item, updateObj);

    res.status(200).json({
      result,
      reason: "상품이 수정되었습니다.",
    });
  } catch (error) {
    next(error);
  }
});

// 관리자 상품 삭제: /api/admin/products?item
productRouter.delete("/admin/products", adminOnly, async (req, res, next) => {
  try {
    const item = req.query.item;
    const result = await productService.deleteProduct(item);

    res.status(200).json({
      result,
      reason: "상품이 삭제되었습니다.",
    });
  } catch (error) {
    next(error);
  }
});

export { productRouter };
