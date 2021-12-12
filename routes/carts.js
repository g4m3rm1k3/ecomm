import express from "express";
import cartsRepo from "../repositories/carts.js";
import productsRepo from "../repositories/products.js";
import cartShowTemplate from "../views/carts/show.js";

const router = express.Router();

// Receive a post request to add an item to a cart
router.post("/cart/products", async (req, res) => {
  // Figure out the cart
  let cart;
  if (!req.session.cartId) {
    // WE don't have a cart we need to create one
    // and store the cart id on eh req.session.cardId
    // property
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // We have a cart! lets get it from the repository
    cart = await cartsRepo.getOne(req.session.cartId);
  }
  const existingItem = cart.items.find(
    (item) => item.id === req.body.productId
  );
  if (existingItem) {
    // increment quantity and save cart
    existingItem.quantity++;
  } else {
    // add new product id and save to array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  await cartsRepo.update(cart.id, {
    items: cart.items,
  });

  // Either increment quantity for existing product
  // or add new product to items array

  res.redirect("/");
});

// Receive a Get request to show all items in a cart
router.get("/cart", async (req, res) => {
  if (!req.session.cartId) {
    res.redirect("/");
  }

  const cart = await cartsRepo.getOne(req.session.cartId);

  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);

    item.product = product;
  }
  res.send(cartShowTemplate({ items: cart.items }));
});

// Receive a post request to delete an item from a cart
router.post("/cart/products/delete", async (req, res) => {
  const { itemId } = req.body;
  const cart = await cartsRepo.getOne(req.session.cartId);
  let items = cart.items;
  const existingItem = cart.items.find((item) => item.id === itemId);
  if (existingItem) {
    if (existingItem.quantity > 1) {
      existingItem.quantity--;
      console.log("less");
    } else {
      items = cart.items.filter((item) => item.id !== itemId);
    }
  }
  await cartsRepo.update(req.session.cartId, { items });

  res.redirect("/cart");
});

export default router;
