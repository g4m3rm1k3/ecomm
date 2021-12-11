import express from "express";

import usersRepo from "../../repositories/users.js";
import signupTemplate from "../../views/admin/auth/signup.js";
import signinTemplate from "../../views/admin/auth/signin.js";

const router = express.Router();

// route handler
router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});
router.post("/signup", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    return res.send("Email in use");
  }
  if (password !== passwordConfirmation) {
    return res.send("Passwords must match");
  }
  // Create a user in our user repe to represent this person
  const user = await usersRepo.create({ email, password });
  //Store the id of that user inside the user cookie
  req.session.userId = user.id; //Added by cookie session

  res.send("Account Created");
});
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
