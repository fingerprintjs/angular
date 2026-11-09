module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['plugin:@typescript-eslint/eslint-recommended', '@fingerprintjs/eslint-config-dx-team'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    // project: ['./projects/demo-angular15/tsconfig.app.json'],
  },
  settings: {},
  plugins: ['@typescript-eslint', 'prettier', '@angular-eslint/eslint-plugin'],
}
