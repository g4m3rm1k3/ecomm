import layout from "../layout.js";
import getError from "../../helpers.js";

export default ({ req, errors }) => {
  return layout({
    content: `<div>
      <form method="POST">
        <input name="email" placeholder="email"/>
        ${getError(errors, "email")}
        <input name="password" placeholder="password"/>
        ${getError(errors, "password")}
        <button>Sign in</button>
      </form>
    </div>`,
  });
};
