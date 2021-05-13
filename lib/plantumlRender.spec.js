const render = require('../lib/plantumlRender');
let testStr = '@startuml\nBob->Alice : hello\n@enduml\n'
render.serverSideRendering(render.config, testStr).then(str =>
    console.log(str)
)
render.localSideRendering(Object.assign(render.config, {link: 'localLink'}), testStr).then(str =>
    console.log(str)
)
render.localSideRendering(Object.assign(render.config, {link: 'inlineBase64'}), testStr).then(str =>
    console.log(str)
)