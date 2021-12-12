import express from "express";
import multer from "multer";
import he from "./middlewares.js";
import productsRepo from "../../repositories/products.js";
import productsNewTemplate from "../../views/admin/products/new.js";
import productsIndexTemplate from "../../views/admin/products/index.js";
import productsEditTemplate from "../../views/admin/products/edit.js";
import stuff from "./validators.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", he.requireAuth, async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products }));
});

router.get("/admin/products/new", he.requireAuth, (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  "/admin/products/new",
  he.requireAuth,
  upload.single("image"),
  [stuff.requireTitle, stuff.requirePrice],
  he.handleErrors(productsNewTemplate),

  async (req, res) => {
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });
  }
);

router.get("/admin/products/:id/edit", he.requireAuth, async (req, res) => {
  const product = await productsRepo.getOne(req.params.id);
  if (!product) {
    return res.send("<h1>Product does not exist</h1>");
  }
  res.send(productsEditTemplate({ product }));
});

router.post(
  "/admin/products/:id/edit",
  he.requireAuth,
  upload.single("image"),
  [stuff.requireTitle, stuff.requirePrice],
  he.handleErrors(productsEditTemplate, async (req) => {
    const product = await productsRepo.getOne(req.params.id);
    return { product };
  }),
  async (req, res) => {
    const changes = req.body;

    if (req.file) {
      changes.image = req.file.buffer.toString("base64");
    }
    try {
      await productsRepo.update(req.params.id, changes);
    } catch (err) {
      return res.send("Could not send item");
    }
    res.redirect("/admin/products");
  }
);
export default router;
