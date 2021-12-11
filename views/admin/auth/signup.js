import layout from "../layout.js";

export default ({ req }) => {
  return layout({
    content: `<div>
      <h2>Your id is ${req.session.userId}</h2>
      <form method="POST">
        <input name="email" placeholder="email"/>
        <input name="password" placeholder="password"/>
        <input name="passwordConfirmation" placeholder="password confirmation"/>
        <button>Sign up</button>
      </form>
    </div>`,
  });
};
