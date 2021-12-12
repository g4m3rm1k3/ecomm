import express from "express";
import productsRepo from "../repositories/products.js";
import renderedProducts from "../views/products/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await productsRepo.getAll();
  return res.send(renderedProducts({ products }));
});

export default router;
