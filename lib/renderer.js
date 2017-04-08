const plantuml = require('./plantuml');

var reg = /(\s*)(```) *(plum|plantuml) *\n?([\s\S]+?)\s*(\2)(\n+|$)/g;

function ignore(data) {
  var source = data.source;
  var ext = source.substring(source.lastIndexOf('.')).toLowerCase();
  return ['.js', '.css', '.html', '.htm'].indexOf(ext) > -1;
}

exports.before = function (data) {
  if (!ignore(data)) {
    data.content = data.content
      .replace(reg, function (raw, start, startQuote, lang, content, endQuote, end) {
        var compress_content = plantuml.compress(content);
        return start + '<img src="' + compress_content + '" />' + end;
      });
  }
};
