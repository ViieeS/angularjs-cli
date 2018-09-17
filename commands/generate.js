/**
 * Generate components, routes, services and pipes with a simple command.
 * The CLI will also create simple test shells for all of these.
 * */

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const Case = require('case');

const OUTPUT_DIR = '.';
const SCHEMAS_DIR = `../schematics`;

const config = {

    js: {export_name_case: 'pascal'},

    css: {export_name_case: 'kebab'},

    get es6() {
        return this.js;
    },

    get scss() {
        return this.css;
    },

    get html() {
        return this.css;
    }
};

const resolveExportName = (rawName, ext) => {
    const caseType = config[ext].export_name_case;
    return Case[caseType](rawName);
};

const replacePlaceholders = (str, options) => {
    let data = str;

    for (const [key, value] of Object.entries(options)) {
        data = data.replace(new RegExp(`__${key}__`, 'g'), value);
    }

    return data;
};

const writeFile = (path, data) => new Promise((resolve, reject) => {

    fs.writeFile(path, data, (err) => {
        if (err) reject(err);
        resolve(`[${path}] has been saved!`);
    });

});


module.exports = (schema, name) => {
    const src = `${SCHEMAS_DIR}/${schema}`;
    const dst = `${OUTPUT_DIR}/${name}`;

    fs.readdir(src, (err, schemas) => {
        if (err) throw new Error(`Unexpected schematic: ${schema}`);

        schemas.forEach(schemaFile => {

            fs.readFile(`${src}/${schemaFile}`, (err, data) => {
                if (err) return console.log(err.toString());

                const file = path.parse(schemaFile);

                const newName = schemaFile.replace('__FILE_NAME__', name);

                const newData = replacePlaceholders(data.toString(), {
                    FILE_NAME: name,
                    EXPORT_NAME: resolveExportName(name, file.ext.substr(1))
                });

                mkdirp(dst, {mode: 0o755}, err => {
                    if (err) console.log(err.toString());
                    writeFile(`${dst}/${newName}`, newData);
                });
            });

        });

    });
};