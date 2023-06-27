import scss from "rollup-plugin-scss";

export default {
  input: 'styles/style.js',
  output: {
    file: "dist/style.js",
    format: "esm",
  },
  plugins: [
    scss({
      output: `dist/style.css`,
      outputStyle: "compressed",
    }),
  ],
};
