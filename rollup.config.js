// import multiInput from 'rollup-plugin-multi-input';
import path from 'path';
import { terser } from "rollup-plugin-terser";



// rollup.config.js
export default {
    input: {
      modal: 'components/modal/script.js',
    },

    output: {
      entryFileNames: `bundle-[name].js`,
      dir: './'
    }
  };


// export default {
//     input: { component: 'components/modal/script.js'},
//     output: [
//         {
//             entryFileNames: 'entry-[name].js',
//             format: 'esm',
//             file: __dirname + '/dist/[name]'
//         },
//         {
//             entryFileNames: 'entry-[name].js',
//             file: __dirname + '/dist/[name]-min',
//             format: 'esm',
//             plugins: [terser()]
//         },
//     ],
//     // plugins: [multiInput({relative: 'components/'})],
// }; 