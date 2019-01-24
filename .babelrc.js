module.exports = function(api) {
  if (api.env('test')) {
    return {
      presets: ['power-assert']
    };
  }
};
