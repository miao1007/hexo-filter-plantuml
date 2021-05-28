const plantumlRender = require("./lib/plantumlRender");

hexo.config.plantuml = Object.assign(plantumlRender.config, hexo.config.plantuml);

const reg = /(\s*)(```) *(puml|plantuml) *\n?([\s\S]+?)\s*(\2)(\n+|$)/g;

function ignore(data) {
    let source = data.source;
    let ext = source.substring(source.lastIndexOf('.')).toLowerCase();
    return ['.js', '.css', '.html', '.htm'].indexOf(ext) > -1;
}

hexo.extend.tag.register('plantuml', (args, content) => {
    var config = hexo.config.plantuml
    var render = config.render || 'PlantUMLServer'
    switch (render) {
        case "PlantUMLServer":
            return plantumlRender.serverSideRendering(config, content);
        case "Local":
            return plantumlRender.localSideRendering(config, content);
        default:
            throw new Error('hexo.config.plantuml.render must be PlantUMLServer or Local');
    }
}, {
    async: true,
    ends: true
});

hexo.extend.filter.register('before_post_render', (data) => {
    if (!ignore(data)) {
        data.content = data.content
            .replace(reg, (raw, start, startQuote, lang, content, endQuote, end) => {
                return start + '{% plantuml %}' + content + '{% endplantuml %}' + end;
            });
    }
}, 9);

hexo.extend.filter.register('after_render:html', (html, { page }) => {
    const config = hexo.config.plantuml;
    const css = `
        .${config.className} {
            display: block;
            margin: 0 auto;
        }
    `;
    if (config.appendCss) {
        return html.replace(/<head>(?!<\/head>).+?<\/head>/s, str => str.replace('</head>', `<style>${css}</style></head>`));
    }
    return html;
});