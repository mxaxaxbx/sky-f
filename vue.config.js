const { defineConfig } = require('@vue/cli-service');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['markdown', 'plaintext'],
      }),
    ],
  },
  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'sky',
    },
  },
});
