#!/usr/bin/env node

const process = require('process');
const minimist = require('minimist');

const commands = require('./commands');

const parse = ([command, ...rest]) => {

    switch (command) {
        case 'generate': {
            const [schema, name] = rest;
            return commands.generate(schema, name);
        }
        case 'rename': {
            const [searchName, newName] = rest;
            return commands.rename(searchName, newName);
        }
        default:
            throw new Error(`Unexpected command: ${command}`);
    }
}

const args = minimist(process.argv.slice(2), {});

parse(args._);