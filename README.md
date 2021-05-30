@wafer-li 's hexo-filter-plantuml has been [transfered](https://github.com/miao1007/hexo-filter-plantuml/pull/3) to me duo to maintain issues.


------
[![version](https://img.shields.io/npm/v/hexo-filter-plantuml.svg)](https://www.npmjs.com/package/hexo-filter-plantuml)
[![download](https://img.shields.io/npm/dm/hexo-filter-plantuml.svg)](https://www.npmjs.com/package/hexo-filter-plantuml)

> I have created another hexo plugin called [hexo-filter-kroki](https://github.com/miao1007/hexo-filter-kroki), which supports 20+ diagrams (including plantuml).

## Features

* Generate raw/base64/urlencoded svg at compile time, no external css and js required.
* Privacy guaranteed. Support rendering locally or self-hosting server.
* Zero npm dependencies.

## How Does it work

<img src="http://www.plantuml.com/plantuml/png/JOuxpi9038JxFSMK_rzmWHGe5L0a4WA1Q2F52fOsDZXUoF79YeUs7FkRHprvPvx667OqArPhx6CQM2fiD4c_g4xyr3QOt5W6t9CwuSb-nIsxtdJs7KXwoaprOQSWcTK7MVdi5VPLuNSlcu_dxT-bRVwBy3ok0aja8QY1PYUJBeB78THBoBBb1G00"/>


## Install

```sh
npm install --save hexo-filter-plantuml
```

## Minimum configuration

No configuration required. By default, it will send your text to `plantuml.com` for rendering, and the base64-encoded images will be inlined in the html.

## Advanced configuration

#### Server-side(recommend)

Please keep in mind, if you want more about privacy/safety, please replace your own [self-hosting](https://plantuml.com/en/picoweb) render server.

```yaml
plantuml:
  #  Local or PlantUMLServer.
  render: "PlantUMLServer"

  # The render server, you can also create your self-hosting sever
  # self-hosting cmd: java -jar /usr/local/Cellar/plantuml/1.2021.5/libexec/plantuml.jar -picoweb
  # server: http://localhost:8080/plantuml
  server: "http://www.plantuml.com/plantuml"
  # "inline": <svg>xxx<svg/>
  # "inlineUrlEncode": <img src='data:image/svg+xml;> 
  # "inlineBase64": <img src='data:image/svg+xml;base64> 
  # "localLink": <img src="/assert/puml/xxxx.svg">
  # "externalLink": <img src="http://www.plantuml.com/plantuml/svg/xxx">
  link: "inline"

  # common options: svg/png
  outputFormat: "svg"

  # class-name for element style. The default style is center-aligned block
  className: "plantuml"
```

#### Client-side
It may be slower for plantuml.jar will restart JVM per code fragment.

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
  PlantJar: "/usr/local/Cellar/plantuml/1.2021.5/libexec/plantuml.jar",

  # common options: svg/png
  outputFormat: "svg"

  # class-name for element style. The default style is center-aligned block
  className: "plantuml"
```



## How to use it?

`puml` and `plantuml` directives both work.
```
​```plantuml
@startuml
Object <|-- ArrayList
Object : equals()
ArrayList : Object[] elementData
ArrayList : size()
@enduml
​```
```
 
> `@startuml` and `@endpuml` are ALWAYS required or the image will fail to be generated.

or

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

Plugin will pick up block body and replace it with generated base64 svg diagram.


see more details at <http://plantuml.com/sitemap-language-specification>
