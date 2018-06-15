require.config({
  paths: {
    lodash: 'node_modules/lodash/lodash',
    jquery: 'node_modules/jquery/dist/jquery',
    text: 'node_modules/requirejs-text/text'
  }
})

require(['app'])
