const { exec } = require('node:child_process');
const args = process.argv.slice(2);

const isDev = (args.indexOf('--dev') !== -1);
const themesArgIndex = args.indexOf('--themes-dir');
let buildCommand = isDev ? 'exec-bin node_modules/.bin/hugo/hugo server' : 'exec-bin node_modules/.bin/hugo/hugo --gc --minify';

if (themesArgIndex !== -1) buildCommand += ` --themesDir ${args[themesArgIndex + 1]}`;

const buildProcess = exec(buildCommand, (error, stdout) => {
    if (error) return console.error(`exec error: ${error}`);
    console.log(`stdout: ${stdout}`);
});

buildProcess.stdout.on('data', function (data) {
    console.log(data);
});
