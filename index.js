var renderer = require('./lib/renderer');

hexo.extend.filter.register('before_post_render', renderer.before, 9);
