module.exports = {
  lintOnSave: 'warning',
  configureWebpack: {
    target: 'web',
    experiments: {
      outputModule: false,
    },
    output: {
      chunkFormat: 'array-push',
    },
  },
};
