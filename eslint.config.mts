import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "node_modules",
      ".pnp",
      ".pnp.js",
      "coverage",
      ".next",
      "out",
      "build",
      ".DS_Store",
      "*.pem",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      ".env*.local",
      ".env",
      ".vercel",
      "*.tsbuildinfo",
      "next-env.d.ts",
      ".sst",
      ".open-next",
      "tailwind.config.ts",
      "sst.config.ts",
      "sst-env.d.ts",
      "postcss.config.js",
    ],
  },

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: "17.0",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
  },

  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
