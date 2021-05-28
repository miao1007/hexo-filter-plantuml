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
    PlantJar: "/usr/local/Cellar/plantuml/1.2021.5/libexec/plantuml.jar",

    // common options
    outputFormat: "svg", //svg/png
    // element class
    className: "plantuml",

    //hidden option
    public_dir: "public",
    assert_path: "assert",
}

/**
 * generate a file path but not created.
 * @param base eg: base dir
 * @param extention eg: exe,svg
 * @returns {string}
 */
function genFullFilePath(base, filename) {
    var dir = path.join(base, "puml");
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return path.join(dir, filename);
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
    const base = path.join(config.public_dir, config.assert_path);
    if (!fs.existsSync(base)) {
        fs.mkdirSync(base, { recursive: true });
    }
    const txtFile = genFullFilePath(base, sha256(str));
    const imgFile = txtFile + '.' + outputFormat;
    return new Promise((resolve, reject) => {
        if (fs.existsSync(imgFile)) {
            console.log("use cached file: " + imgFile)
            // use cache
            resolveByImgFile(resolve, config, imgFile)
            return;
        }
        fs.writeFile(txtFile, str, function (err) {
            if (err) {
                return console.log(err);
            }
            childProcess.execFile("java", args(txtFile), function (err, stdout, stderr) {
                // fs.unlinkSync(txtFile);
                if (err || stderr) {
                    console.log("err=");
                    console.log("sdterr=" + stderr);
                    reject(err || stdout)
                } else {
                    resolveByImgFile(resolve, config, imgFile)
                }
            });
        });
    })
}

function resolveByImgFile(resolve, config, imgFile) {
    const { link, className } = config;
    switch (link) {
        case "inlineUrlEncode":
        case "inlineBase64":
        case "inline":
            const text = fs.readFileSync(imgFile, 'utf8');
            // fs.unlinkSync(imgFile);
            if (link === "inlineBase64") {
                resolve(`<img class='${className}' src='data:image/svg+xml;base64,${new Buffer(text).toString("base64")}'>`);
            } else if (link === "inlineUrlEncode") {
                resolve(`<img class='${className}' src='data:image/svg+xml;utf8,${encodeURIComponent(text)}'>`);
            } else {
                resolve(text.replace(/<svg(.*?)>/g, `<svg $1 class="${className}">$2`));
            }
        case "localLink":
            const realUrl = imgFile.replace(config.public_dir, "");
            resolve(`<img src="${realUrl}"/>`);
    }
}

/**
 *
 * @param config
 * @param str
 * @param outputFormat
 * @returns {string|Promise<any>}
 */
function serverSideRendering(config, str) {
    const realUrl = makeURL(config.server, str, config.outputFormat);
    const request = (realUrl.startsWith("https") ? https : http)
    switch (config.link) {
        case "inlineUrlEncode":
        case "inlineBase64":
        case "inline":
            return new Promise((resolve, reject) => {
                request.get(realUrl, response => {
                    var data = [];
                    response.on('data', function (chunk) {
                        data.push(chunk);
                    }).on('end', function () {
                        const buffer = Buffer.concat(data);
                        if (config.link === "inlineBase64") {
                            resolve(`<img class="${config.className}" src='data:image/svg+xml;base64,${buffer.toString("base64")}'>`);
                        } else if (config.link === "inlineUrlEncode") {
                            resolve(`<img class="${config.className}" src='data:image/svg+xml;utf8,${encodeURIComponent(buffer.toString())}'>`);
                        } else {
                            resolve(buffer.toString().replace(/<svg(.*?)>/g, `<svg $1 class="${className}">$2`))
                        }
                    });
                });
            })
        case "localLink":
            const base = path.join(config.public_dir, config.assert_path);
            if (!fs.existsSync(base)) {
                fs.mkdirSync(base, { recursive: true });
            }
            return new Promise((resolve, reject) => {
                request.get(realUrl, response => {
                    const svgFile = genFullFilePath(base, sha256(str)) + "." + config.outputFormat;
                    var stream = response.pipe(fs.createWriteStream(svgFile));
                    stream.on("finish", function () {
                        const realUrl = svgFile.replace(config.public_dir, "");
                        resolve(`<img class="${config.className}" src="${realUrl}"/>`);
                    });
                });
            })
        case "externalLink":
            return `<img class="${config.className}" src="${realUrl}" />`;
    }
}


module.exports = {
    config: config,
    serverSideRendering: serverSideRendering,
    localSideRendering: localSideRendering
}