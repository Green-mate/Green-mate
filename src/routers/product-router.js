import is from "@sindresorhus/is";
import { Router } from "express";
import { Product } from "../db";
import { loginRequired } from "../middlewares";

const productRouter = Router();

// 상품 전체 조회: /api/products?category==all
// 상품 카테고리별 조회: /api/products?category=다육식물
productRouter.get("/products", async (req, res, next) => {
  try {
    const category = req.query.category;
    const products = await Product.find({ category });

    res.status(200).json(products);
  } catch (error) {
    next(err);
  }
});

// 상품 상세 조회: /api/products/1
productRouter.get("/products/:pid", async (req, res, next) => {
  try {
    const pid = req.params.pid;
    const products = await Product.findOne({ _id: pid });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// 관리자 상품 추가: /api/admin/product
productRouter.post(
  "/admin/product",
  //loginRequired,
  async (req, res, next) => {
    try {
      // if (is.emptyObject(req.body)) {
      //   throw new Error(
      //     "headers의 Content-Type이 application/json으로 설정되지 않았습니다."
      //   );
      // }

      const { productName, category, productPrice, productImage, stock } =
        req.body;

      const newProduct = await Product.create({
        productName,
        category,
        productPrice: Number(productPrice),
        productImage,
        stock: Number(stock),
      });

      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }
);

// 관리자 상품 수정: /api/admin/product/1
productRouter.patch(
  "/admin/product/:pid",
  //loginRequired,
  async (req, res, next) => {
    try {
      // if (is.emptyObject(req.body)) {
      //   throw new Error(
      //     "headers의 Content-Type이 application/json으로 설정되지 않았습니다."
      //   );
      // }

      const pid = req.params.pid;
      const { productName, category, productPrice, productImage, stock } =
        req.body;

      const filter = { _id: pid };
      // 일단은 전체만 수정 가능. 이따가 필드별로 수정하는 함수로 나눌 예정.
      const update = {
        productName,
        category,
        productPrice,
        productImage,
        stock,
      };

      const products = await Product.findOneAndUpdate(filter, update, {
        new: true,
      });

      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
);

// 관리자 상품 삭제: /api/admin/product/1
productRouter.delete(
  "/admin/product/:pid",
  //loginRequired,
  async (req, res, next) => {
    try {
      // if (is.emptyObject(req.body)) {
      //   throw new Error(
      //     "headers의 Content-Type이 application/json으로 설정되지 않았습니다."
      //   );
      // }

      const pid = req.params.pid;
      const deleteProduct = await Product.deleteOne({ _id: pid });

      res.status(200).send("delete: OK");
    } catch (error) {
      next(error);
    }
  }
);

export { productRouter };
