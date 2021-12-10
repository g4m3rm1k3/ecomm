import express from "express";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import usersRepo from "./repositories/users.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["a5lsi3ecn4kx8w"],
  })
);

// route handler
app.get("/signup", (req, res) => {
  res.send(`<div>
    Your id is ${req.session.userId}
    <form method="POST">
      <input name="email" placeholder="email"/>
      <input name="password" placeholder="password"/>
      <input name="passwordConfirmation" placeholder="password confirmation"/>
      <button>Sign up</button>
    </form></div>`);
});

app.post("/signup", async (req, res) => {
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

app.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

app.get("/signin", (req, res) => {
  res.send(`<div>
  <form method="POST">
    <input name="email" placeholder="email"/>
    <input name="password" placeholder="password"/>
    <button>Sign in</button>
  </form></div>`);
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send("Email not found");
  }
  if (user.password !== password) {
    return res.send("Password does not match");
  }

  req.session.userId = user.id;
  res.send("You are singed in");
});

app.listen(3000, () => {
  console.log("Listening");
});
