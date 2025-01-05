import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]
  },
  {
    languageOptions: { globals: globals.browser }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "react/self-closing-comp": "error",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-empty-object-type": "off" ,
      "react/no-unknown-property": "error",
    },
  },
];
