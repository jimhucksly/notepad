module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: "tsconfig.json",
    tsconfigRootDir: ".",
    extraFileExtensions: [".vue", ".html"],
    ecmaVersion: 2019,
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    "standard",
    "plugin:vue/recommended",
    "plugin:vue-libs/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  globals: {
    __static: true
  },
  plugins: [
    "@typescript-eslint",
    "vue"
  ],
  rules: {
    "no-console": "off",
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // disallows multiple blank lines (no-multiple-empty-lines)
    "no-multiple-empty-lines": [2, {"max": 3, "maxBOF": 2, "maxEOF": 1}],
    // require or disallow a space before function parenthesis
    "space-before-function-paren": ["error", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always"
    }],
    // enforce spacing before and after keywords (keyword-spacing)
    "keyword-spacing": [2, {
        "overrides": {
        "if": {"after": false},
        "for": {"after": false},
        "while": {"after": false},
        "switch": {"after": false},
        "import": {"after": true},
        "catch": {"after": false}
        }
      }
    ],
    // disallow or enforce spaces inside of parentheses (space-in-parens)
    "space-in-parens": ["error", "never"],
    // disallow trailing whitespace at the end of lines (no-trailing-spaces)
    "no-trailing-spaces": ["error", { "skipBlankLines": true, "ignoreComments": true }],
    // disallow control characters in regular expressions (no-control-regex)
    "no-control-regex": "error",
    // disallow unnecessary escape usage (no-useless-escape)
    "no-useless-escape": "off",
    "no-useless-constructor": "off",
    "no-useless-return": "off",
    "prefer-promise-reject-errors": "off",
    "object-curly-spacing": ["error", "always"],
    "vue/html-self-closing": [
      "error", {
        "html": {
          "void": "never",
          "normal": "never",
          "component": "always"
        },
        "svg": "always",
        "math": "never"
      }
    ],
    "vue/max-attributes-per-line": "off",
    "vue/attributes-order": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/v-on-style": ["error", "shorthand"],
    "vue/v-bind-style": ["error", "shorthand"],
    "vue/no-v-html": "off",
    "vue/require-default-prop": "off",
    "vue/order-in-components": [
      "error", {
        "order": [
          "el",
          "name",
          "key",
          "parent",
          "functional",
          ["delimiters", "comments"],
          ["components", "directives", "filters"],
          "extends",
          "mixins",
          ["provide", "inject"],
          "ROUTER_GUARDS",
          "layout",
          "middleware",
          "validate",
          "scrollToTop",
          "transition",
          "loading",
          "inheritAttrs",
          "model",
          ["props", "propsData"],
          "emits",
          "setup",
          "asyncData",
          "data",
          "head",
          "computed",
          "watch",
          "watchQuery",
          "methods",
          "fetch",
          "LIFECYCLE_HOOKS",
          ["template", "render"],
          "renderError"
        ]
      }
    ],
    "vue/one-component-per-file": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-floating-promises": [
      "off",
      {
        "ignoreVoid": false,
        "ignoreIIFE": false
      }
    ],
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
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ],
    "promise/catch-or-return": [
      "error",
      {
        "allowFinally": true
      }
    ],
    "@typescript-eslint/prefer-nullish-coalescing": "warn",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^",
        "varsIgnorePattern": "^$"
      }
    ],
    "@typescript-eslint/func-call-spacing": ["error", "never"],
    "@typescript-eslint/no-useless-constructor": "error",
    "@typescript-eslint/prefer-for-of": "warn",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/no-unnecessary-type-arguments": "warn",
    "@typescript-eslint/prefer-function-type": "warn",
    "@typescript-eslint/prefer-readonly": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": [
      "off",
      {
        "allowExpressions": true
      }
    ],
    "@typescript-eslint/brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    "@typescript-eslint/indent": ["off", 2],
    "@typescript-eslint/quotes": [
      "error",
      "single",
      {
        "avoidEscape": true
      }
    ],
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
    "@typescript-eslint/no-extra-parens": ["off"],
    "@typescript-eslint/semi": ["error", "never"],
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        "multiline": {
          "delimiter": "none",
          "requireLast": false
        },
        "singleline": {
          "delimiter": "comma",
          "requireLast": false
        }
      }
    ],
    "@typescript-eslint/triple-slash-reference": [
      "error",
      {
        "path": "always",
        "types": "always",
        "lib": "always"
      }
    ],
    "@typescript-eslint/no-var-requires": "off"
  }
}
