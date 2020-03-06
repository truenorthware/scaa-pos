module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "@vue/prettier",
    "plugin:prettier/recommended",
    "eslint:recommended",
    "@vue/typescript"
  ],
  plugins: ["vuetify"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "comma-dangle": ["error", "never"],
    "linebreak-style": "off",
    "vuetify/no-deprecated-classes": "error"
    // "htmlWhitespaceSensitivity": "ignore",

    // "prettier/prettier": [
    //   "error",
    //   {
    //     htmlWhitespaceSensitivity: "ignore",
    //     jsxBracketSameLine: true
    //   }
    // ]
  },
  parserOptions: {
    parser: "@typescript-eslint/parser"
  }
};
