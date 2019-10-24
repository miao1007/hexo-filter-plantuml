const http = require("http");
const https = require("https");
const childProcess = require('child_process');
const makeURL = require("./serverRender").makeURL;
const fs = require('fs');
const path = require('path');

const crypto = require('crypto');
const sha256 = x => crypto.createHash('sha256').update(x, 'utf8').digest('hex');

const config = {
    //  Local and PlantUMLServer.
    render: "PlantUMLServer",

    // only works with PlantUMLServer
    server: "http://www.plantuml.com/plantuml",
    // create <img src='data:image/svg+xml;base64> or <img src="/xxx.svg"> or <img src="http://third/svg/xxx">
    // "inline","inlineBase64","inlineUrlEncode","localLink","externalLink",
    link: "inlineBase64",

    // only works with Local
    // where your dot binary
    GraphvizDotFile: "/usr/local/bin/dot",
    // where your jar
    PlantJar: "/usr/local/Cellar/plantuml/1.2019.10/libexec/plantuml.jar",

    // common options
    outputFormat: "svg", //svg/png

    //hidden option
    public_dir: "public",
    asset_path: "assert",
}

/**
 * generate a file path but not created.
 * @param base eg: base dir
 * @param extention eg: exe,svg
 * @returns {string}
 */
function genFullFilePath(base, filename) {
    var dir = path.join(base, "puml");
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    var s = path.join(dir, filename);
    console.log(path.resolve(s))
    return s;
}

function localSideRendering(config, str) {
    var GraphvizDotFile = config.GraphvizDotFile;
    var PlantJar = config.PlantJar;
    if (!PlantJar || !GraphvizDotFile) {
        throw "Please fullfill GraphvizDotFile and PlantJar"
    }
    var outputFormat = config.outputFormat;
    // run plantuml -help for more
    const args = function (txtFile) {
        return [
            '-jar', PlantJar,
            // fixed x11 problems on CentOS
            '-Djava.awt.headless=true',
            '-t' + outputFormat, '-graphvizdot', GraphvizDotFile,
            txtFile
        ];
    }
    const base = path.join(config.public_dir, config.asset_path);
    if (!fs.existsSync(base)){
        fs.mkdirSync(base);
    }
    const txtFile = genFullFilePath(base,sha256(str));
    return new Promise((resolve, reject) => {
        fs.writeFile(txtFile, str, function (err) {
            if (err) {
                return console.log(err);
            }
            childProcess.execFile("java", args(txtFile), function (err, stdout, stderr) {
                if (err || stderr) {
                    console.log("err=");
                    console.log(stderr);
                    fs.unlinkSync(txtFile);
                    reject(err || stdout)
                } else {
                    const svgFile = txtFile + '.' + outputFormat;
                    const text = fs.readFileSync(svgFile, 'utf8');
                    switch (config.link) {
                        case "inlineUrlEncode":
                        case "inlineBase64":
                        case "inline":
                            const svgFile = txtFile + '.' + outputFormat;
                            const text = fs.readFileSync(svgFile, 'utf8');
                            fs.unlinkSync(svgFile);
                            if(config.link === "inlineBase64"){
                                resolve("<img src='data:image/svg+xml;base64," + new Buffer(text).toString("base64") + "'>");
                            } else if(config.link === "inlineUrlEncode") {
                                resolve("<img src='data:image/svg+xml;utf8," + encodeURIComponent(text) + "'>");
                            } else {
                                resolve(text);
                            }
                        case "localLink":
                            const realUrl = ( txtFile + '.' + outputFormat).replace(config.public_dir,"");
                            console.log(realUrl)
                            resolve("<img src=\"" + realUrl + "\"/>");
                    }
                }
            });
        });
    })
}

/**
 *
 * @param config
 * @param str
 * @param outputFormat
 * @returns {string|Promise<any>}
 */
function serverSideRendering(config, str) {
    var realUrl = makeURL(config.server, str, config.outputFormat);
    switch (config.link) {
        case "inlineUrlEncode":
        case "inlineBase64":
        case "inline":
            return new Promise((resolve, reject) => {
                (realUrl.startsWith("https") ? https : http).get(realUrl, response => {
                    var data = [];
                    response.on('data', function(chunk) {
                        data.push(chunk);
                    }).on('end', function() {
                        const buffer = Buffer.concat(data);
                        if(config.link === "inlineBase64"){
                            resolve("<img src='data:image/svg+xml;base64," + buffer.toString("base64") + "'>");
                        } else if(config.link === "inlineUrlEncode") {
                            resolve("<img src='data:image/svg+xml;utf8," + encodeURIComponent(buffer.toString()) + "'>");
                        } else {
                            resolve(buffer.toString())
                        }
                    });
                });
            })
        case "localLink":
            const base = path.join(config.public_dir, config.asset_path);
            if (!fs.existsSync(base)){
                fs.mkdirSync(base);
            }
            return new Promise((resolve, reject) => {
                (realUrl.startsWith("https") ? https : http).get(realUrl, response => {
                    const svgFile = genFullFilePath(base, sha256(str)) + "." + config.outputFormat;
                    var stream = response.pipe(fs.createWriteStream(svgFile));
                    stream.on("finish", function () {
                        const realUrl = svgFile.replace(config.public_dir,"");
                        console.log(realUrl)
                        resolve("<img src=\"" + realUrl + "\"/>");
                    });
                });
            })
        case "externalLink":
            return '<img src="' + realUrl + '" />';
    }
}


module.exports = {
    config: config,
    serverSideRendering: serverSideRendering,
    localSideRendering: localSideRendering
}