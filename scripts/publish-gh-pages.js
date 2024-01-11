/* eslint-disable require-jsdoc */
const { execSync } = require('child_process');
const path = require('path');
const github = require('@actions/github');
const core = require('@actions/core');
const githubToken = process.env.TOKEN;
const userName = core.getInput('user_name') || process.env.GITHUB_ACTOR;
const email = core.getInput('user_email') || `${process.env.GITHUB_ACTOR}@users.noreply.github.com`;
const deployCommitMessage = `deploy: ${process.env.GITHUB_SHA}`;
const worspaceDir = process.env.WORKSPACE_DIR;
const docsDir = path.join(worspaceDir, 'docs');
const docsBuildDir = path.join(worspaceDir, '../public');
const GH_PAGES_BRANCH = 'gh-pages';

function exec(command, cwd = worspaceDir) {
    return execSync(command, { cwd, stdio: 'inherit' });
}

/**
 * Will return the remote url that works with token
 * @returns {string}
 */
function getRemoteUrl() {
    const publishRepo = `${github.context.repo.owner}/${github.context.repo.repo}`;
    return `https://x-access-token:${githubToken}@github.com/${publishRepo}.git`;
}

function prepareDocs() {
    core.startGroup('Preparing documentation for deploy');
    core.info('[INFO] Installing documentation modules');
    exec('rm -rf node_modules');
    exec('rm -rf package-lock.json');
    exec('npm install', docsDir);
    core.info('[INFO] Building documentation');
    exec('npm run build', docsDir);
    core.info(`[INFO] Creating a temp folder of the documentation source to ${docsBuildDir}`);
    exec(`cp -R public ${docsBuildDir}`, docsDir);
    core.endGroup();
}

function transferDocs() {
    core.startGroup(`Transfer documentation to ${GH_PAGES_BRANCH}`);
    core.info(`[INFO] Fetching repository...`);
    exec(`git fetch --no-recurse-submodules`);
    core.info(`[INFO] Checking out ${GH_PAGES_BRANCH} branch`);
    exec(`git checkout ${GH_PAGES_BRANCH}`);
    core.info(`Clearing the previous branch files`);
    exec('rm -rf *');
    core.info(`Copying the documentation source from ${docsBuildDir} to the branch`);
    exec(`cp -R ${docsBuildDir}/* ./`);
    core.info(`Copied the documentation source from ${docsBuildDir} to the branch`);
    core.endGroup();
}

function deployDocs() {
    core.startGroup(`Deploy documentation to ${GH_PAGES_BRANCH}`);
    const changes = execSync(`git status`, { cwd: worspaceDir });

    if (changes.toString().indexOf('nothing to commit, working tree clean') !== -1) {
        core.info(`[INFO] There are no new changes in the documentation. Will skip the deploy.`);
        core.endGroup();
        return;
    }

    core.info('[INFO] Files has been changed.\n' + changes);
    const remoteURL = getRemoteUrl();
    core.info(`[INFO] Setting remote URL with token`);
    exec(`git remote rm origin`);
    exec(`git remote add origin ${remoteURL}`);
    core.info(`[INFO] Staging documentation files`);
    exec(`git add -A`);
    core.info(`[INFO] Setting git config`);
    exec(`git config user.name ${userName}`);
    exec(`git config user.email ${email}`);
    core.info(`[INFO] Committing the changes`);
    exec(`git commit -m "${deployCommitMessage}"`);
    core.info(`[INFO] Push the changes to ${GH_PAGES_BRANCH}`);
    exec(`git push origin ${GH_PAGES_BRANCH}`);
    core.endGroup();
}

function main() {
    core.startGroup('Dump input data');
    core.info(`\
[INFO] UserName: ${userName}
[INFO] UserEmail: ${email}
[INFO] DeployCommitMessage: ${deployCommitMessage}
`);
    core.endGroup();

    prepareDocs();
    transferDocs();
    deployDocs();
}

main();
