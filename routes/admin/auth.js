import express from "express";
import { check, validationResult } from "express-validator";
import usersRepo from "../../repositories/users.js";
import signupTemplate from "../../views/admin/auth/signup.js";
import signinTemplate from "../../views/admin/auth/signin.js";

const router = express.Router();

// route handler
router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});
router.post(
  "/signup",
  [
    check("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Must be a valid email")
      .custom(async (email) => {
        const existingUser = await usersRepo.getOneBy({ email });
        if (existingUser) {
          throw new Error("Email in use");
        }
      }),
    check("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Must be between 4 and 20 characters"),
    check("passwordConfirmation")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Must be between 4 adn 20 characters")
      .custom(async (passwordConfirmation, { req }) => {
        if (req.body.password !== passwordConfirmation) {
          throw new Error("Passwords must match");
        }
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { email, password, passwordConfirmation } = req.body;
    const user = await usersRepo.create({ email, password });
    res.send("Account Created");
  }
);
router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});
router.get("/signin", (req, res) => {
  res.send(signinTemplate({ req }));
});
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send("Email not found");
  }
  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );
  if (!validPassword) {
    return res.send("Password does not match");
  }

  req.session.userId = user.id;
  res.send("You are singed in");
});

export default router;
