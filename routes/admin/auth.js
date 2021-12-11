import express from "express";
import { check, validationResult } from "express-validator";
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
  [stuff.requireEmail, stuff.requirePassword, stuff.requirePasswordValidation],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send(signupTemplate({ req, errors }));
    }
    const { email, password } = req.body;
    const user = await usersRepo.create({ email, password });
    res.send("Account Created");
  }
);

// get signout
router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

// get-signin
router.get("/signin", (req, res) => {
  res.send(signinTemplate({}));
});

// post-signin
router.post(
  "/signin",
  [stuff.requireEmailExists, stuff.requireValidPasswordForUser],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(signinTemplate({ errors }));
    }
    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });

    // req.session.userId = user.id;
    res.send("You are singed in");
  }
);

export default router;
