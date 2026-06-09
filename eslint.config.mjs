import { defineConfig } from 'eslint/config';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-plugin-prettier/recommended';
import importPlugin from 'eslint-plugin-import';
import parserTs from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';
import stylistic from '@stylistic/eslint-plugin';
import simpleImportSort from "eslint-plugin-simple-import-sort";
import pluginPromise from 'eslint-plugin-promise';
import vuetify from 'eslint-plugin-vuetify';
import sonarjs from 'eslint-plugin-sonarjs';

export default defineConfig(
  [
    {
      ignores: [
        'src/lib',
        'src/lib/*',
        'coverage',
        '**/*.js',
        '**/*.mjs',
        '**/*.ejs',
        '**/*.html',
        '**/*.json',
        '**/*.scss',
        '**/*.css',
        '**/*.md',
        '**/*.mdx',
        '**/*.conf',
        '**/*.png',
        '**/*.jpg',
        '**/*.svg',
        '**/*.pdf',
        '**/*.lock',
        '**/Dockerfile*',
      ]
    },
    // typescript
    typescriptEslint.configs.recommended,
    {
      languageOptions: {
        parser: vueParser,
        globals: {
          ...globals.node,
          ...globals.browser
        },
        sourceType: 'module',
        parserOptions: {
          parser: parserTs,
          extraFileExtensions: ['.vue', '.html'],
          projectService: true,
          tsconfigRootDir: import.meta.dirname
        },
      },
      rules: {
        "@typescript-eslint/member-ordering": "off",
        "@typescript-eslint/no-magic-numbers": [
          "off",
          {
            "ignoreNumericLiteralTypes": true,
            "ignoreEnums": true,
            "enforceConst": true,
            "ignoreReadonlyClassProperties": true,
            "ignore": [0, 1, 24, 60, 1000]
          }
        ],
        "@typescript-eslint/no-useless-constructor": "error",
        "@typescript-eslint/prefer-for-of": "warn",
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unnecessary-type-arguments": "warn",
        "@typescript-eslint/prefer-function-type": "warn",
        "@typescript-eslint/prefer-readonly": "warn",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/explicit-function-return-type": [
          "off",
          {
            "allowExpressions": true
          }
        ],
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            "argsIgnorePattern": "^",
            "varsIgnorePattern": "$",
            "caughtErrorsIgnorePattern": "^_|e",
          }
        ],
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-misused-promises": [
          "error",
          {
            "checksVoidReturn": false
          }
        ],
        "@typescript-eslint/no-extra-parens": ["off"],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/typedef": [
          "error",
          {
            "arrayDestructuring": false,
            "arrowParameter": false,
            "memberVariableDeclaration": false,
            "objectDestructuring": false,
            "parameter": true,
            "propertyDeclaration": true,
            "variableDeclaration": false,
            "variableDeclarationIgnoreFunction": true
          }
        ],
        "@typescript-eslint/no-inferrable-types": [
          "error",
          {
            "ignoreParameters": true
          }
        ],
        "@typescript-eslint/naming-convention": [
          "error",
          {
            "selector": "default",
            "format": ["camelCase", "PascalCase", "UPPER_CASE"],
            "leadingUnderscore": "allow",
            "filter": {
              "regex": "(\\w*-\\w*)|(:\\w*)|(@\\w*)|(\\d)",
              "match": false
            }
          },
          {
            "selector": "variable",
            "format": ["camelCase", "UPPER_CASE", "PascalCase"],
            "leadingUnderscore": "allow"
          },
          {
            "selector": "parameter",
            "format": ["camelCase", "PascalCase"],
            "leadingUnderscore": "allow"
          },
          {
            "selector": "memberLike",
            "modifiers": ["public", "private", "static"],
            "format": ["camelCase", "UPPER_CASE"],
            "leadingUnderscore": "allow"
          },
          {
            "selector": "typeLike",
            "format": ["PascalCase", "UPPER_CASE"]
          }
        ],
        "@typescript-eslint/no-floating-promises": [
          "off",
          {
            "ignoreVoid": false,
            "ignoreIIFE": false
          }
        ],
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/restrict-plus-operands": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/require-await": "error",
        "@typescript-eslint/no-shadow": "error",
        "@typescript-eslint/prefer-promise-reject-errors": "off",
        "@typescript-eslint/only-throw-error": "off",
        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/no-base-to-string": "off",
        "@typescript-eslint/ban-ts-comment": "off"
      }
    },
    // promise
    pluginPromise.configs['flat/recommended'],
    {
      rules: {
        "promise/catch-or-return": [
          "error",
          {
            "allowFinally": true
          }
        ],
      }
    },
    // vuetify
    ...vuetify.configs['flat/base'],
    {
      rules: {
        "vuetify/no-deprecated-classes": "off",
        "vuetify/grid-unknown-attributes": "error",
        "vuetify/no-deprecated-colors": "off",
      }
    },
    // sonarjs
    sonarjs.configs.recommended,
    {
      rules: {
        "sonarjs/cognitive-complexity": "off",
        "sonarjs/prefer-immediate-return": "error",
        "sonarjs/no-duplicate-string": "error",
        "sonarjs/no-nested-switch": "off",
        "sonarjs/null-dereference": "off",
        "sonarjs/no-ignored-exceptions": "off",
        "sonarjs/code-eval": "off",
        "sonarjs/no-dead-store": "off",
        "sonarjs/function-return-type": "off",
        "sonarjs/argument-type": "off",
        "sonarjs/no-nested-conditional": "off",
        "sonarjs/slow-regex": "off",
        "sonarjs/anchor-precedence": "off",
        "sonarjs/post-message": "off",
        "sonarjs/stateful-regex": "off",
        "sonarjs/no-parameter-reassignment": "off",
        "sonarjs/use-type-alias": "off",
        "sonarjs/no-async-constructor": "off",
        "sonarjs/no-duplicate-string": "off",
        "sonarjs/no-clear-text-protocols": "off",
        "sonarjs/different-types-comparison": "off",
        "sonarjs/no-nested-functions": "off",
        "sonarjs/no-skipped-tests": "off"
      }
    },
    // simple sort
    {
      plugins: {
        'simple-import-sort': simpleImportSort,
      },
      rules: {
        "simple-import-sort/imports": [
          "error",
          {
            // The default grouping, but with no blank lines.
            "groups": [["^\\u0000", "^@?\\w", "^[^.]", "^\\."]]
          }
        ],
      }
    },
    // import
    {
      plugins: {
        import: importPlugin,
      },
      settings: {
        'import/resolver': {
          typescript: {}
        }
      },
    },
    // eslint
    {
      plugins: {
        '@stylistic': stylistic,
      },
      rules: {
        "indent": ["error", 2],
        "no-shadow": [
          "off",
          {
            "builtinGlobals": false
          }
        ],
        "no-duplicate-imports": [
          "error",
          {
            "includeExports": true
          }
        ],
        "no-template-curly-in-string": "error",
        "block-scoped-var": "error",
        "curly": ["error", "all"],
        "eqeqeq": "error",
        "max-classes-per-file": "off",
        "no-alert": "error",
        "no-console": ["error", { "allow": ["time", "timeEnd"] }],
        "no-else-return": [
          "error",
          {
            "allowElseIf": false
          }
        ],
        "no-implicit-coercion": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-multi-spaces": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-wrappers": "error",
        "no-return-await": "error",
        "no-self-compare": "error",
        "no-sequences": "error",
        "no-throw-literal": "error",
        "no-unused-expressions": "error",
        "no-useless-call": "error",
        "no-useless-concat": "error",
        "no-useless-return": "error",
        "no-useless-assignment": "off",
        "prefer-promise-reject-errors": "error",
        "radix": "error",
        "no-undefined": "off",
        "promise/always-return": "off",
        "array-bracket-newline": [
          "off",
          {
            "multiline": true
          }
        ],
        "comma-dangle": "off",
        "comma-style": "error",
        "eol-last": "error",
        "key-spacing": "error",
        "keyword-spacing": "error",
        "new-parens": "error",
        "no-bitwise": "warn",
        "no-lonely-if": "warn",
        "no-multiple-empty-lines": "error",
        "no-nested-ternary": "off",
        "no-new-object": "error",
        "no-tabs": [
          "error",
          {
            "allowIndentationTabs": true
          }
        ],
        "no-trailing-spaces": "error",
        "no-unneeded-ternary": "error",
        "no-whitespace-before-property": "error",
        "object-curly-newline": "error",
        "object-curly-spacing": ["error", "always"],
        "semi-spacing": "error",
        "space-before-blocks": "error",
        "space-before-function-paren": [
          "error",
          {
            "anonymous": "always",
            "named": "never",
            "asyncArrow": "always"
          }
        ],
        "space-in-parens": "error",
        "space-infix-ops": "error",
        "space-unary-ops": "error",
        "spaced-comment": ["error", "always"],
        "switch-colon-spacing": "error",
        "arrow-body-style": ["error", "as-needed"],
        "arrow-parens": ["error", "as-needed"],
        "arrow-spacing": "error",
        "no-useless-computed-key": "error",
        "no-useless-rename": "error",
        "object-shorthand": ["error", "always"],
        "prefer-arrow-callback": "warn",
        "prefer-destructuring": "off",
        "rest-spread-spacing": ["error", "never"],
        "sort-imports": "off",
        "template-curly-spacing": "error",
        "@stylistic/semi": ["error", "always"],
        "@stylistic/member-delimiter-style": [
          "error",
          {
            "multiline": {
              "delimiter": "semi"
            }
          }
        ],
        "func-call-spacing": ["error", "never"],
        "no-case-declarations": "off",
        "vue/html-self-closing": "off",
        "camelcase": "off",
        "require-await": "off",
      }
    },
    // prettier
    eslintConfigPrettier,
  ]
);
