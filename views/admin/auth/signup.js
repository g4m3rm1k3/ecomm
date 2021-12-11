import layout from "../layout.js";
import getError from "../../helpers.js";

export default ({ req, errors }) => {
  return layout({
    content: `<div>
      <h2>Your id is ${req.session.userId}</h2>
      <form method="POST">
        <input name="email" placeholder="email"/>
        ${getError(errors, "email")}
        <input name="password" placeholder="password"/>
        ${getError(errors, "password")}
        <input name="passwordConfirmation" placeholder="password confirmation"/>
        ${getError(errors, "passwordConfirmation")}
        <button>Sign up</button>
      </form>
    </div>`,
  });
};
