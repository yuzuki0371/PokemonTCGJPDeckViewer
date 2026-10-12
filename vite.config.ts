import { defineConfig, lazyPlugins } from "vite-plus";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  fmt: {
    printWidth: 120,
    quoteProps: "consistent",
    trailingComma: "es5",
    arrowParens: "avoid",
    ignorePatterns: [],
  },
  lint: {
    plugins: ["react", "typescript"],
    env: {
      browser: true,
      es2022: true,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
  },
  staged: {
    "*": "vp fmt --check --no-error-on-unmatched-pattern",
  },
  plugins: lazyPlugins(() => [react(), tailwindcss()]),
  base: "/",
});
