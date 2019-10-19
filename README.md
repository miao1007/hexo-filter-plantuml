## Features

* Generate raw/base64/urlencoded svg at compile time, no external css and js required.
* Privacy guarantee. Support rendering locally or self-hosted server.
* Zero npm dependencies.

## How Does it work

```
1. Your PlantUML string quote with puml
2. Local or service side rendering
3. SVG(XML)
4. inline or external <img src='data:image/xxx'>
```



## Install

```sh
npm install --save https://github.com/miao1007/hexo-filter-plantuml
```

## Configuration

#### Minimum configuration

Use plantuml.com for renderding, and the base64-encoding image will be inlined in html.

```yaml
plantuml:
    render: "PlantUMLServer"
```

#### Advanced configuration

Server-side

Please keep in mind, if you want more about privacy/safety, please replace your own self-hosted render server.

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

Client-side

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