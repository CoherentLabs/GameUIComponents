const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { getPackageJSON } = require('./helpers');
const { getPublicVersion } = require('./utils');
const COMPONENTS_PATH = path.join(__dirname, '../components');
const LIBRARY_PATH = path.join(__dirname, '../');
const CLI_PATH = path.join(__dirname, '../tools');
const { Octokit } = require('octokit');
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = 'CoherentLabs';
const repo = 'GameUIComponents';
// We need to force fetch tags because of this problem -> https://github.com/actions/checkout/issues/290#issuecomment-680260080
// Also the fetch-depth should be 0 in the publish.yml
execSync(`git fetch --tags --force`, { cwd: __dirname, stdio: 'inherit' });
/** @type {string} The latest tag that will be used as reference from where the release notes should be generated */
const latestTag = execSync(`git describe --tags --abbrev=0`, { cwd: __dirname, encoding: 'utf8' }).replace('\n', '');

/**
 * Checks if some component should be updated in npm if its version is bumped
 * @param {string} component
 * @param {string} folder
 * @returns {boolean}
 */
function shouldUpdate(component, folder = COMPONENTS_PATH) {
    const packageJSON = getPackageJSON(component, folder);
    if (!packageJSON) return false;

    const name = packageJSON.name;
    // if a component doesn't exist in the registry then it must be published
    if (!JSON.parse(execSync(`npm search ${name} --json`, { encoding: 'utf8' })).length) return true;

    const localVersion = packageJSON.version;
    const publicVersion = getPublicVersion(name);

    if (localVersion !== publicVersion) {
        console.log(`Package ${component} has new local version - ${localVersion}. The current npm version is ${publicVersion}.`);
        return true;
    }

    return false;
}

/**
 * Will generate the release notes based on the latest tag and the current one
 * @param {string} tagName
 * @returns {Promise<any>}
 */
async function getReleaseNotes(tagName) {
    console.log(`Generating release notes for '${tagName}' based on the latest tag in the repo - ${latestTag}`);

    return await octokit.request('POST /repos/{owner}/{repo}/releases/generate-notes', {
        owner,
        repo,
        tag_name: tagName,
        target_commitish: 'master',
        previous_tag_name: latestTag,
        configuration_file_path: '.github/release.yml',
        headers: { 'X-GitHub-Api-Version': '2022-11-28' },
    });
}

/**
 * Will generate new release with a specified tag
 * @param {string} tag
 * @returns {undefined}
 */
async function createRelease(tag) {
    try {
        const release = await octokit.request(`GET /repos/{owner}/{repo}/releases/tags/{tag}`, {
            owner,
            repo,
            tag: tag,
            headers: { 'X-GitHub-Api-Version': '2022-11-28' },
        });
        if (release.status === 200) return console.warn(`There already added release for ${tag}! Will not create release!`);
    } catch (error) {
        console.log(`Release for ${tag} has not been found. Will release it!`);
    }

    const releaseNotes = await getReleaseNotes(tag);
    const res = await octokit.request('POST /repos/{owner}/{repo}/releases', {
        owner,
        repo,
        body: releaseNotes.data.body,
        tag_name: tag,
        target_commitish: 'master',
        name: tag,
        draft: false,
        prerelease: false,
        generate_release_notes: false,
        headers: { 'X-GitHub-Api-Version': '2022-11-28' },
    });

    // Returns 201 for success. Check the API docs.
    if (res.status === 201) return console.log(`Released ${tag} successfully!`);

    console.error(`Something went wrong releasing ${tag}. Request response: ${res}`);
    process.exitCode = -1;
}

/**
 * Will publish component changes in npm
 * @param {string} component
 * @param {string} folder
 */
async function publish(component, folder = COMPONENTS_PATH) {
    try {
        const { version, name } = JSON.parse(fs.readFileSync(path.join(folder, component, 'package.json')));
        const tag = `${name}@${version}`;

        if (execSync(`git tag -l ${tag}`) === '') {
            execSync(`git tag ${tag}`, { cwd: path.join(folder, component), encoding: 'utf8', stdio: 'inherit' });
            execSync(`git push origin ${tag}`, { cwd: path.join(folder, component), encoding: 'utf8', stdio: 'inherit' });
            console.log(`Successfully created new tag '${tag}'`);
        } else console.warn(`The tag ${tag} already exists. Won't create tag!`);

        await createRelease(tag);
        execSync(`npm publish`, { cwd: path.join(folder, component), encoding: 'utf8', stdio: 'inherit' });
        console.log(`Successfully published ${component}.`);
    } catch (err) {
        console.error(err);
        process.exitCode = -1;
    }
}

/** */
async function main() {
    try {
        if (shouldUpdate('lib', LIBRARY_PATH)) await publish('lib', LIBRARY_PATH);
        if (shouldUpdate('cli', CLI_PATH)) await publish('cli', CLI_PATH);
        if (shouldUpdate('interaction-manager', LIBRARY_PATH)) await publish('interaction-manager', LIBRARY_PATH);

        const components = fs.readdirSync(COMPONENTS_PATH);
        for (const component of components) {
            if (shouldUpdate(component)) await publish(component);
        }
    } catch (error) {
        console.error(error);
        process.exitCode = -1;
    }
}

main();
