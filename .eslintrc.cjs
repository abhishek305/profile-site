module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  ignorePatterns: ["dist", "node_modules", ".kilo"],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } },
  plugins: ["react-refresh", "@typescript-eslint", "jsx-a11y"],
  settings: {
    "jsx-a11y": {
      // The project ships no third-party components, so the polfill and
      // text-content rules have nothing to catch here.
      "polymorphicPropName": "as",
      "usePragma": false,
    },
  },
  rules: {
    "react-refresh/only-export-components": "warn",
    "@typescript-eslint/no-explicit-any": "off",

    // The h1 on a standalone route is followed by sections that deliberately
    // render no heading of their own, so heading order is checked by hand.
    "jsx-a11y/heading-has-content": "error",

    // One live region per panel is a deliberate choice; the default flags any
    // aria-live on a non-interactive element.
    "jsx-a11y/no-noninteractive-element-interactions": "off",
  },
};
