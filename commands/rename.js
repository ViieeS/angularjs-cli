const fs = require('fs');
const path = require('path');
const colors = require('colors/safe');

const renameCompleteMsg = (oldPath, newPath) => {
    return `Rename: ${colors.cyan(path.basename(oldPath))} -> ${colors.cyan(path.basename(newPath))} complete.`;
};

const renameFiles = (dir, newName) => new Promise((resolve, reject) => {

    fs.readdir(dir, {withFileTypes: true}, (err, files) => {
        if (err) return console.log(err.toString());

        const promises = files.map(file => {
            const dirName = path.basename(dir);
            const newFileName = file.name.replace(dirName, newName);
            const oldPath = path.resolve(dir, file.name);
            const newPath = path.resolve(dir, newFileName);

            if (!file.isFile() || !file.name.includes(dirName)) return;

            return new Promise((resolve, reject) => {
                fs.rename(oldPath, newPath, err => {
                    if (err) reject(err);
                    else resolve(renameCompleteMsg(oldPath, newPath));
                })
            });
        });

        Promise.all(promises).then(
            (msgs) => {
                msgs.forEach(msg => console.log(msg));
                resolve();
            },
            errors => {
                console.error(errors.toString());
                reject();
            }
        );
    });
});

module.exports = async (rawPath, newName) => {
    const cwd = process.cwd();
    const oldPath = path.resolve(cwd, rawPath);
    const newPath = path.resolve(cwd, newName);

    await renameFiles(oldPath, newName);

    await new Promise((resolve, reject) => fs.rename(oldPath, newPath, err => {
        if (err) reject(err);
        else resolve(renameCompleteMsg(oldPath, newPath));
    })).then(
        msg => console.log(msg),
        err => {
            throw err;
        }
    );

    console.log('done.');
};