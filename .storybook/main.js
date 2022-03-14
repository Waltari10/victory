var path = require("path");

module.exports = {
  addons: [
    "storybook-addon-performance/register",
    {
      name: "@storybook/addon-storysource",
      options: {
        rule: {
          test: [/\.stories\.jsx?$/],
          include: [path.resolve(__dirname, "../stories")]
        },
        loaderOptions: {
          prettierConfig: {
            printWidth: 80,
            singleQuote: false
          }
        }
      }
    }
  ],
  stories: ["../stories/*.stories.js"],
  core: {
    builder: "webpack5"
  }
};
