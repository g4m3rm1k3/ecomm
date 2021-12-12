import layout from "../layout.js";

const productsIndexTemplate = ({ products }) => {
  const renderedProducts = products
    .map((product) => {
      return `
      <div>${product.title}</div>
      <div>${product.price}</div>
    `;
    })
    .join("");

  return layout({
    content: `<h1 class="title">Products</h1>${renderedProducts}`,
  });
};

export default productsIndexTemplate;
