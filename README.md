# Chatta

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname
  }
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Cloud Functions デプロイ時のエラーについて
- Error: Your project chatta-8ea13 must be on the Blaze (pay-as-you-go) plan to complete this command. Required API artifactregistry.googleapis.com can't be enabled until the upgrade is complete. To upgrade, visit the following URL:<br>（エラー： このコマンドを実行するには、プロジェクト chatta-8ea13 が Blaze（従量課金）プランである必要があります。必須 API artifactregistry.googleapis.com は、アップグレードが完了するまで有効にできません。アップグレードするには、以下のURLにアクセスしてください：）
 - 実行コマンド
  - `$ firebase deploy --only functions`

## Reactのアップグレード手順
- 以下コマンドを実行する。（18.3.1にアップグレードする場合）
`npm install react@18.3.1 react-dom@18.3.1`