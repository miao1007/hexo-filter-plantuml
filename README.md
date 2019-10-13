# hexo-filter-plantuml

> Using PlantUML to generate UML Diagram for hexo

## Install

```
npm install --save hexo-filter-plantuml
```

## Configuration


minum
```yaml
plantuml:
    render: "PlantUMLServer"
```

advanced

```yaml
plantuml:
    //  Local and PlantUMLServer.
    render: "PlantUMLServer",

    // only works with PlantUMLServer
    server: "http://www.plantuml.com/plantuml",
    // create <img src='data:image/svg+xml;base64> or <img src="/xxx.svg"> or <img src="http://third/svg/xxx">
    // "inline","localLink","externalLink",
    inline: "inline",

    // only works with Local
    // where your dot binary
    GraphvizDotFile: "/usr/local/bin/dot",
    // where your jar
    PlantJar: "/usr/local/Cellar/plantuml/1.2019.10/libexec/plantuml.jar",

    // common options
    outputFormat: "svg", //svg/png
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
