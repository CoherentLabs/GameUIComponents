import components from 'coherent-gameface-components';
import Slider from '../umd/slider.development.js';
import {pm} from 'postmessage-polyfill';
import {fetch as fetchPolyfill} from 'whatwg-fetch';
//

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.keyCode === 82) location.reload();
})
window.postMessage = function(message) {
    pm({
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message
    });
};