

@wafer-li 's hexo-filter-plantuml has been [transfered](https://github.com/miao1007/hexo-filter-plantuml/pull/3) to me duo to maintain issues.


------
[![version](https://img.shields.io/npm/v/hexo-filter-plantuml.svg)](https://www.npmjs.com/package/hexo-filter-plantuml)
[![download](https://img.shields.io/npm/dm/hexo-filter-plantuml.svg)](https://www.npmjs.com/package/hexo-filter-plantuml)


## Features

* Generate raw/base64/urlencoded svg at compile time, no external css and js required.
* Privacy guarantee. Support rendering locally or self-hosted server.
* Zero npm dependencies.

## How Does it work

<img src="http://www.plantuml.com/plantuml/png/JOuxpi9038JxFSMK_rzmWHGe5L0a4WA1Q2F52fOsDZXUoF79YeUs7FkRHprvPvx667OqArPhx6CQM2fiD4c_g4xyr3QOt5W6t9CwuSb-nIsxtdJs7KXwoaprOQSWcTK7MVdi5VPLuNSlcu_dxT-bRVwBy3ok0aja8QY1PYUJBeB78THBoBBb1G00"/>


## Install

```sh
npm install --save hexo-filter-plantuml
```

## Minimum configuration

It will use `plantuml.com` for rendering, and the base64-encoded images will be inlined in the html.

```yaml
plantuml:
    render: "PlantUMLServer"
```

## Advanced configuration

#### Server-side(recommend)

Please keep in mind, if you want more about privacy/safety, please replace your own [self-hosted](https://github.com/plantuml/plantuml-server) render server.

```yaml
plantuml:
    #  Local or PlantUMLServer.
    render: "PlantUMLServer"

    # the server,you can change your self-hosted sever for privacy
    server: "http://www.plantuml.com/plantuml"
    # "inline": <svg>xxx<svg/>
    # "inlineUrlEncode": <img src='data:image/svg+xml;> 
    # "inlineBase64": <img src='data:image/svg+xml;base64> 
    # "localLink": <img src="/assert/puml/xxxx.svg">
    # "externalLink": <img src="http://www.plantuml.com/plantuml/svg/xxx">
    link: "inline"

    # common options: svg/png
    outputFormat: "svg"
```

#### Client-side

```yaml
plantuml:
    #  Local or PlantUMLServer.
    render: "Local"

    # "inline": <svg>xxx<svg/>
    # "inlineUrlEncode": <img src='data:image/svg+xml;> 
    # "inlineBase64": <img src='data:image/svg+xml;base64> 
    # "localLink": <img src="/assert/puml/xxxx.svg">
    link: "inline"

    # where your dot binary
    GraphvizDotFile: "/usr/local/bin/dot"
    # where your jar
    PlantJar: "/usr/local/Cellar/plantuml/1.2019.10/libexec/plantuml.jar"

    # common options: svg/png
    outputFormat: "svg"
```



## How to use it?

```
{% plantuml %}
@startuml
Object <|-- ArrayList
Object : equals()
ArrayList : Object[] elementData
ArrayList : size()
@enduml
{% endplantuml %}
```

> `@startuml` and `@endpuml` are ALWAYS required or the image will fail to be generated.

or

```
​```puml
@startuml
Object <|-- ArrayList
Object : equals()
ArrayList : Object[] elementData
ArrayList : size()
@enduml
​```
```

Plugin will pick up block body and replace it with generated base64 svg diagram.

> `puml` and `plantuml` tags both work.

see more details at <http://plantuml.com/sitemap-language-specification>