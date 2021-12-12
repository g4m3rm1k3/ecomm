import express from "express";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import authRouter from "./routes/admin/auth.js";
import adminProductsRouter from "./routes/admin/products.js";
import productsRouter from "./routes/products.js";

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({
    keys: ["a5lsi3ecn4kx8w"],
  })
);

app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);

app.listen(3000, () => {
  console.log("Listening");
});
