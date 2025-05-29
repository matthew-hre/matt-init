import antfu from "@antfu/eslint-config";

export default antfu(
  {
    type: "app",
    typescript: true,
    formatters: true,
    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
    },
    ignores: ["**/migrations/*", "next-env.d.ts"],
    overrides: [
      {
        files: ["template/**/*.tsx"],
        parserOptions: {
          ignoreDiagnostics: [7026],
        },
      },
    ],
  },
  {
    rules: {
      "ts/no-redeclare": "off",
      "ts/consistent-type-definitions": ["error", "type"],
      "no-console": "off",
      "antfu/no-top-level-await": ["off"],
      "node/prefer-global/process": ["off"],
      "node/no-process-env": ["error"],
      "perfectionist/sort-imports": ["error", { tsconfigRootDir: "." }],
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["README.md"],
        },
      ],
    },
  },
  {
    // Template files don't have reliable type information
    files: ["./template/**/*.{ts,tsx}"],
    extends: ["tseslint.configs.disableTypeChecked"],
  },
);
