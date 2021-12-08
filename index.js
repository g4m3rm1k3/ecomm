import express from "express";

const app = express();

// route handler
app.get("/", (req, res) => {
  res.send(`{<div>
    <form method="POST">
      <input name="email" placeholder="email"/>
      <input name="password" placeholder="password"/>
      <input name="passwordConfirmation" placeholder="password confirmation"/>
      <button>Sign up</button>
    </form></div>}`);
});

app.post("/", (req, res) => {
  req.on("data", (data) => {
    const parsed = data.toString("utf8").split("&");
    const formData = {};
    for (let pair of parsed) {
      const [key, value] = pair.split("=");
      formData[key] = value;
    }
    console.log(formData);
  });
  res.send("Account Creates");
});

app.listen(3000, () => {
  console.log("Listening");
});
