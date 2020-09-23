const path = require('path');
const fs = require('fs');
const rollup = require('rollup');
const { format } = require('path');
const terser = require('rollup-plugin-terser').terser;

const FORMATS = [
    'cjs',
    'umd',
    'esm'
];

const ENVIRONMENTS = [
    'prod',
    'dev'
];


function getComponentDirectories() {
    return fs.readdirSync(path.join(__dirname, 'components'), { withFileTypes: false });
}

function generateOutputOptions(directory, format = 'umd', moduleName, isProd = false,) {
    const suffix = isProd ? '.production.min' : '.development';

    const outputOptions = {
        format: format,
        dir: path.win32.join(directory, format),
        entryFileNames: `${moduleName}${suffix}.js`,
    };

    if (format === 'umd') outputOptions.name = moduleName;
    if (isProd) outputOptions.plugins = [terser()];

    return outputOptions;
}

function buildForTargets(moduleName, inputOptions, formats, environments) {

    for (let format of formats) {
        for (let environment of environments) {
            createBundle(inputOptions, generateOutputOptions(
                path.win32.dirname(inputOptions.input),
                format,
                moduleName,
                environment === 'prod' ? true : false
            ));
        }
    }
}

function buildEverything() {
    const inputOptions = {
        input: path.win32.join(__dirname, 'lib', 'components.js')
    };
    buildForTargets('components', inputOptions, FORMATS, ENVIRONMENTS);

    const components = getComponentDirectories();

    for (let component of components) {
        const inputOptions = {
            input: path.win32.join(__dirname, 'components', component, 'script.js')
        };

        buildForTargets(component, inputOptions, FORMATS, ENVIRONMENTS);
    }
}


async function createBundle(inputOptions, outputOptions) {
    // create a bundle
    const bundle = await rollup.rollup(inputOptions);

    console.log(bundle.watchFiles); // an array of file names this bundle depends on

    // generate output specific code in-memory
    // you can call this function multiple times on the same bundle object
    const { output } = await bundle.generate(outputOptions);

    for (const chunkOrAsset of output) {
        if (chunkOrAsset.type === 'asset') {
            // For assets, this contains
            // {
            // fileName: 'asset-[name]',              // the asset file name
            //   source: string | Uint8Array    // the asset source
            // type: 'asset'                  // signifies that this is an asset
            // }
            console.log('Asset', chunkOrAsset);
        } else {
            // For chunks, this contains
            // {
            //   code: string,                  // the generated JS code
            //   dynamicImports: string[],      // external modules imported dynamically by the chunk
            //   exports: string[],             // exported variable names
            //   facadeModuleId: string | null, // the id of a module that this chunk corresponds to
            fileName: 'bundle-[name]',              // the chunk file name
                //   implicitlyLoadedBefore: string[]; // entries that should only be loaded after this chunk
                //   imports: string[],             // external modules imported statically by the chunk
                //   importedBindings: {[imported: string]: string[]} // imported bindings per dependency
                //   isDynamicEntry: boolean,       // is this chunk a dynamic entry point
                //   isEntry: boolean,              // is this chunk a static entry point
                //   isImplicitEntry: boolean,      // should this chunk only be loaded after other chunks
                //   map: string | null,            // sourcemaps if present
                //   modules: {                     // information about the modules in this chunk
                //     [id: string]: {
                //       renderedExports: string[]; // exported variable names that were included
                //       removedExports: string[];  // exported variable names that were removed
                //       renderedLength: number;    // the length of the remaining code in this module
                //       originalLength: number;    // the original length of the code in this module
                //     };
                //   },
                //   name: string                   // the name of this chunk as used in naming patterns
                //   referencedFiles: string[]      // files referenced via import.meta.ROLLUP_FILE_URL_<id>
                //   type: 'chunk',                 // signifies that this is a chunk
                // }
                console.log('Chunk', chunkOrAsset.modules);
        }
    }

    // or write the bundle to disk
    await bundle.write(outputOptions);
}

buildEverything();