# hexo-filter-plantuml

> Using PlantUML to generate UML Diagram for hexo

## Install

```
npm install --save hexo-filter-plantuml
```

## Configuration


minimum configuration(use plantuml.com for renderding)

```yaml
plantuml:
    render: "PlantUMLServer"
```

advanced configuration


```yaml
plantuml:
    #  Local or PlantUMLServer.
    render: "PlantUMLServer"

    # the server,you can change your self-hosted sever for privacy
    # only works with render with <PlantUMLServer> on
    server: "http://www.plantuml.com/plantuml"
    # "inline": <img src='data:image/svg+xml;base64> 
    # "localLink": <img src="/assert/puml/xxxx.svg">
    # "externalLink": <img src="http://www.plantuml.com/plantuml/svg/xxx">
    inline: "inline"

    # only works with render with <Local> on
    # where your dot binary
    GraphvizDotFile: "/usr/local/bin/dot"
    # where your jar
    PlantJar: "/usr/local/Cellar/plantuml/1.2019.10/libexec/plantuml.jar"

    # common options: svg/png
    outputFormat: "svg"
```

## Usage

Define the UML as bellow:

    ```puml
    @startuml
    class A
    @enduml
    ```

And it will render as:

![](http://www.plantuml.com/plantuml/svg/SoWkIImgAStDuKhEIImkLd3aSaZDIm7o0G00)

## Thanks to

- [hexo-filter-flowchart](https://github.com/bubkoo/hexo-filter-flowchart) [@bubkoo](https://github.com/bubkoo)
- [hexo-tag-plantuml](https://github.com/oohcoder/hexo-tag-plantuml) [@oohcoder](https://github.com/oohcoder)
