import commonjs from "@rollup/plugin-commonjs";
import vue from "rollup-plugin-vue";
import resolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import { uglify } from "rollup-plugin-uglify";
import typescript from "rollup-plugin-typescript2";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import filesize from "rollup-plugin-filesize";

export default {
  input: "src/index-iife.ts",
  output: [
    {
      format: "iife",
      file: `dist/iife/index.min.js`,
      exports: "named",
      name: "lupaSearch",
    },
  ],
  plugins: [
    resolve({
      browser: true,
    }),
    typescript({ module: "ESNext" }),
    vue({
      needMap: false,
      css: true,
      compileTemplate: true,
    }),
    babel({
      babelHelpers: "runtime",
      plugins: ["@babel/plugin-transform-runtime"],
      extensions: [".js", ".jsx", ".ts", ".tsx", ".es6", ".es", ".mjs", ".vue"],
    }),
    commonjs(),
    json(),
    uglify(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    filesize(),
  ],
};
