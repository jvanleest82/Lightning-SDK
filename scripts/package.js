const rollup = require('rollup');
const {terser} = require("rollup-plugin-terser");
const babel = require("rollup-plugin-babel");
const babelPresetEnv = require("@babel/preset-env");
const fs = require("fs");
const shell = require("shelljs");
const targz = require("targz");

const info = {};
let logging = true;

function release(preventLogging){
    if(preventLogging){
        logging = false;
    }
    return new Promise((resolve, reject)=>{
        getName()
            .then(() => ensureDir())
            .then(() => copyMetadata())
            .then(() => copyAppFiles())
            .then(() => copyAppSrc())
            .then(() => bundleApp())
            .then(() => pack())
            .then(()=>{
                info.absolutePath = process.cwd() + "/dist/" + info.mpkg;
                log('MPK file created! ' + process.cwd() + "/" + info.mpkg);
                log('(Notice that mpkg files are actually tgz files)');
                resolve(info);
            })
            .catch(err => {
                return reject(err);
                process.exit(-1);
            });
    })

}

function getName() {
    return new Promise((resolve, reject) => {
        fs.readFile("./metadata.json", function(err, res) {
            if (err) {
                return reject(new Error("Metadata.json file can't be read: run this from a directory containing a metadata file."));
            }

            const contents = res.toString();
            info.data = JSON.parse(contents);

            if (!info.data.identifier) {
                return reject(new Error("Can't find identifier in metadata.json file"));
            }

            if(!info.data.version){
                return reject(new Error("Can't find version in metadata.json file"));
            }

            if(!info.data.name){
                return reject(new Error("No name provided for your app"));
            }

            return resolve();
        });
    });
}

function ensureDir() {
    info.dest = `${info.data.identifier}.mpkg`;
    const rm = (destination)=>{
        return new Promise((resolve)=>{
            shell.rm("-rf",destination);
            resolve();
        });
    };
    return rm(`./dist/${info.dest}`).then(()=>{
        shell.mkdir("-p",`./dist/${info.dest}`);
        return Promise.resolve();
    });
}

function copyMetadata() {
    return execShell(()=>{
        shell.cp("-r","./metadata.json",`./dist/${info.dest}`);
    });
}

function copyAppFiles() {
    if (fs.existsSync("./static")) {
        return execShell(()=>{
            shell.cp("-r","./static",`./dist/${info.dest}`);
        });
    } else {
        return Promise.resolve();
    }
}

function copyAppSrc() {
    if (fs.existsSync("./src")) {
        return execShell(()=>{
            shell.cp("-r","./src",`./dist/${info.dest}`);
        });
    } else {
        return Promise.resolve();
    }
}

function bundleApp() {
    const input = "./src/App.js";
    const name = "APP_" + info.data.identifier.replace(/[^0-9a-zA-Z_$]/g, "_");

    return Promise.all([
        createBundle({
            name, input,
            output: `./dist/${info.dest}/appBundle.js`,
            plugins:[terser({keep_fnames: true})]
        }),
        createBundle({
            name, input,
            output: `./dist/${info.dest}/appBundle.es5.js`,
            plugins:[babel({presets: [babelPresetEnv]}), terser({keep_fnames: true})],
        })
    ]);
}

async function createBundle({input, output, plugins=[], name}){
    const bundle = await rollup.rollup({input, plugins});
    const content = await bundle.generate({format: 'iife', name});

    fs.writeFileSync(output, content.code);

    return "done";
}

function pack() {
    info.mpkg = info.data.identifier + ".mpkg.tgz";
    return tar(`./dist/${info.dest}`,`./dist/${info.dest}.tgz`);
}

function execShell(cb){
    cb();
    return Promise.resolve();
}

function tar(src,dest){
    return new Promise((resolve, reject)=>{
        targz.compress({
            src, dest
        },(err)=>{
            if(err){
                log("ERR:", err);
                reject(err);
            }else{
                log(`TAR: ${src}`);
                resolve();
            }
        })
    });
}

const log = (message) => {
    if(logging){
        console.log(message);
    }
}

module.exports.release = release;