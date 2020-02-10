const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = ({ config, mode }) => {
  // `mode` can either be 'DEVELOPMENT' or 'PRODUCTION'
  // 'PRODUCTION' is used when building the static version of storybook.

  config.module.rules.push({
    test: /\.(js|ts|tsx)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
      },
    ],
  });

  config.module.rules.push({
    test: /\.vue$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'vue-loader',
      },
    ],
  });

  config.plugins.push(
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(mode === 'DEVELOPMENT'),
    })
  );

  config.plugins.push(new VueLoaderPlugin());

  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
