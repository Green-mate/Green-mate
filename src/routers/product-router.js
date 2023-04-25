import is from "@sindresorhus/is";
import { Router } from "express";
import { adminOnly, asyncHandler } from "../middlewares";
import { productService } from "../services";
import { pagenate, krDate } from "../utils";
import { logger } from "../../config/winston";

const productRouter = Router();

// 상품 전체 조회: /api/products?page=1&perPage=9
productRouter.get(
  "/products",
  asyncHandler(async (req, res, next) => {
    // page(현재 페이지 number), perPage(한 페이지에 보여줄 페이지 수)
    const page = parseInt(req.query.page || 1);
    const perPage = parseInt(req.query.perPage || 9);
    // total: 전체 상품 개수
    const total = await productService.getProductsCountAll();
    if (page > Math.ceil(total / perPage)) {
      throw new Error("현재 페이지는 마지막 페이지보다 클 수 없습니다.");
    }
    const products = await productService.getProductsAll();
    const pagenatedProducts = await pagenate(page, perPage, products);

    res.status(200).json({
      total,
      pagenatedProducts,
    });
  })
);

//상품 카테고리별 조회: /api/products/categories?덩굴성&page=1&perPage=9
productRouter.get(
  "/products/categories",
  asyncHandler(async (req, res, next) => {
    const category = req.query.category;
    const page = parseInt(req.query.page || 1);
    const perPage = parseInt(req.query.perPage || 9);

    const total = await productService.getProductsCount(category);
    const products = await productService.getProducts(category);
    const pagenatedProducts = await pagenate(page, perPage, products);

    res.status(200).json({
      total,
      pagenatedProducts,
    });
  })
);

// 상품 상세 조회: /api/products/:shortId
productRouter.get(
  "/products/:shortId",
  asyncHandler(async (req, res, next) => {
    const shortId = req.params.shortId;
    const products = await productService.getProductById(shortId);

    res.status(200).json(products);
  })
);

// 관리자 상품관리 페이지 상품목록 조회: /api/admin/products
productRouter.get(
  "/admin/products",
  adminOnly,
  asyncHandler(async (req, res, next) => {
    const products = await productService.getAdminProducts();

    res.status(200).json(products);
  })
);

// // 관리자 상품 추가: /api/admin/products
productRouter.post(
  "/admin/products",
  adminOnly,
  asyncHandler(async (req, res, next) => {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type이 application/json으로 설정되지 않았습니다."
      );
    }
    const { productName, category, productPrice, productImage, stock } =
      req.body;
    const date = krDate(); // 한국 시간대로 설정.
    const productObj = {
      productName,
      category,
      productPrice: Number(productPrice),
      productImage,
      stock: Number(stock),
      createdDate: date,
    };
    const products = await productService.addProducts(productObj);
    logger.info(`추가한 상품:\n ${products}`);

    res.status(201).json({
      result: "success",
      reason: "상품이 추가되었습니다.",
    });
  })
);

// // 관리자 상품 수정: /api/admin/products?item=상품명
productRouter.patch(
  "/admin/products",
  adminOnly,
  asyncHandler(async (req, res, next) => {
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
    const products = await productService.updateProduct(item, updateObj);
    logger.info(`수정한 상품:\n ${products}`);

    res.status(200).json({
      result: "success",
      reason: "상품이 수정되었습니다.",
    });
  })
);

// 관리자 상품 삭제: /api/admin/products?item=상품명
productRouter.delete(
  "/admin/products",
  adminOnly,
  asyncHandler(async (req, res, next) => {
    const item = req.query.item;
    const products = await productService.getProductByName(item);
    await productService.deleteProduct(item);
    logger.info(`삭제한 상품:\n ${products}`);

    res.status(200).json({
      result: "success",
      reason: "상품이 삭제되었습니다.",
    });
  })
);

export { productRouter };
