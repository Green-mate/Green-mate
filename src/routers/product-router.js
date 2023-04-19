import is from "@sindresorhus/is";
import { Router } from "express";
import { Product } from "../db";

const productRouter = Router();

// 상품 전체 조회: /api/products/?category=all&page=1&perPage=3
// 상품 카테고리별 조회: /api/products?category=야생화&page=1&perPage=3
productRouter.get("/products", async (req, res) => {
  const category = req.query.category;
  const products = await Product.find({ category });

  res.status(200).json(products);
});

// 상품 상세 조회: /api/products/pid=1
productRouter.get("/products/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const products = await Product.findOne({ pid });

  res.status(200).json(products);
});

// 관리자 상품 추가: /api/admin/product -> /api/product/admin으로 변경!
productRouter.post("/product/admin", async (req, res) => {
  const { pid, productName, category, productPrice, productImage, stock } =
    req.body;

  const products = Product.create({
    pid: Number(pid),
    productName,
    category,
    productPrice: Number(productPrice),
    productImage,
    stock: Number(stock),
  });

  res.status(201).send("Post: OK");
});

// 관리자 상품 수정: /api/admin/product/:pid
productRouter.patch("/product/admin/:pid", async (req, res) => {
  const { pid, productName, category, productPrice, productImage, stock } =
    req.body;
  const updateObj = {
    ...(productName && { productName }),
    ...(category && { category }),
    ...(productPrice && { productPrice: Number(productPrice) }),
    ...(productImage && { productImage }),
    ...(stock && { stock: Number(stock) }),
  };
  const products = await Product.updateOne({ pid }, { updateObj });
  console.log(products);
  res.status(200).json(products);
});

// 관리자 상품 삭제: /api/admin/product/:pid
productRouter.delete("/product/admin/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const products = await Product.deleteOne({ pid });

  res.status(200).send("delete: OK");
});

export { productRouter };
