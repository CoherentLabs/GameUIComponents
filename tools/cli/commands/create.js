const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const path = require('path');
const templatesLocation = path.join(__dirname, '../templates');

function createFolder(directory, folderName) {
    const fullPath = path.resolve(path.join(directory, folderName));

    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, {recursive: true});
    } else {
        console.log(`Component with name ${folderName} already exists in ${directory}`);
        // TODO: would you like to overwite?
    }

    return fullPath;
}

function capitalize(s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function toUpperCamelCase(words) {
    let formatted = '';
    words.forEach(name => {
        formatted += capitalize(name);
    });

    return formatted;
}

function create(name, directory) {
    const componentFolder = createFolder(path.join(directory), name);
    const demoFolder = createFolder(componentFolder, 'demo');


    fs.readdirSync(templatesLocation).forEach(file => {
        const filename = file;
        const data = fs.readFileSync(path.join(templatesLocation, file), 'utf8');
        const className = toUpperCamelCase(name.split('-'));

        const templateVars = {
            componentName: name,
            className: className
        }

        const fillTemplate = function (templateString, templateVars) {
            return new Function("return `" + templateString + "`;").call(templateVars);
        }

        const fileContent = fillTemplate(data, templateVars);

        if(filename !== 'demo.html' && filename !== 'demo.js') {
            fs.writeFileSync(path.join(componentFolder, filename), fileContent, 'utf8');
        } else {
            fs.writeFileSync(path.join(demoFolder, filename), fileContent, 'utf8');
        }
    });
}

module.exports = yargs(hideBin(process.argv))
    .command('create [name] [directory]', 'start the server', (yargs) => {
        yargs
            .positional('name', {
                describe: 'port to bind on',
                default: 'example-component'
            })
            .positional('directory', {
                describe: 'port to bind on',
                default: './example-component'
            })
    }, (argv) => {
        if (argv.verbose) console.info(`start server on :${argv.port}`)
        console.log('==============================');
        create(argv.name, argv.directory)
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging'
    })
    .argv