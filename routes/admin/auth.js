import express from "express";
import he from "./middlewares.js";
import usersRepo from "../../repositories/users.js";
import signupTemplate from "../../views/admin/auth/signup.js";
import signinTemplate from "../../views/admin/auth/signin.js";
import stuff from "./validators.js";

const router = express.Router();

// route handler
router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

// post-signup
router.post(
  "/signup",
  [
    stuff.requireEmail,
    stuff.requirePassword,
    stuff.requirePasswordConfirmation,
  ],
  he.handleErrors(signupTemplate),

  async (req, res) => {
    const { email, password } = req.body;
    const user = await usersRepo.create({ email, password });

    req.session.userId = user.id;

    res.redirect("/admin/products");
  }
);

// get signout
router.get("/signout", (req, res) => {
  req.session = null;
  res.redirect("/signin");
});

// get-signin
router.get("/signin", (req, res) => {
  res.send(signinTemplate({}));
});

// post-signin
router.post(
  "/signin",
  [stuff.requireEmailExists, stuff.requireValidPasswordForUser],
  he.handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;

    res.redirect("/admin/products");
  }
);

router.get("/", (req, res) => {
  res.redirect("/signin");
});

export default router;
