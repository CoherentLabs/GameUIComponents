/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Router, Route, BrowserHistory } from './router.development.js';

const NumbersModel = {
    'whole': [1, 2, 3, 4, 5, 6, -7],
    'rational': [1.5, 1.4, -2.3]
};

const template = `<div>
<gameface-route id="home" to="/">Home</gameface-route>
<gameface-route id="documentation" to="/documentation">Documentation</gameface-route>
<gameface-route id="numbers" to="/numbers">Numbers</gameface-route>
<gameface-route id="vowel" to="/letters/vowel">Vowels</gameface-route>
<gameface-route id="consonant" to="/letters/consonant">Consonant</gameface-route>
<gameface-route id="missing" to="/missing">Missing Page</gameface-route>
<router-view></router-view>
<div>`;

const numbersTemplate = `<div>
<gameface-route id="whole" to="/numbers/whole">Whole</gameface-route>
<gameface-route id="rational" to="/numbers/rational">Rational</gameface-route>
<div>`;

const homeTemplate = `<div>Home</div>`;
const notFoundTemplate = `<div>Can't find this page.</div>`;
const numberTemplate = `<div id="numbers"></div>`;

const vowelsTemplate = `<div>A vowel is a syllabic speech sound pronounced without any stricture in the vocal tract.[1] Vowels are one of the two principal classes of speech sounds, the other being the consonant.</div>`;
const consonantTemplate = `<div>In articulatory phonetics, a consonant is a speech sound that is articulated with complete or partial closure of the vocal tract. Examples are [p], pronounced with the lips; [t], pronounced with the front of the tongue;</div>`;

function beforeUnload(callback, params) {
    const confirmationDialog = document.createElement('div');
    const confirmButton = document.createElement('button');
    confirmButton.classList.add('confirmButton');

    confirmButton.textContent = 'Yes';

    confirmButton.onclick = (e) => {
        callback.apply(null, params);
        confirmationDialog.parentElement.removeChild(confirmationDialog);
        confirmButton.style.display = 'none';
    }

    confirmationDialog.appendChild(confirmButton);
    document.body.appendChild(confirmationDialog);

    return false;
}

const browserHistory = new BrowserHistory();
Route.use(browserHistory);

function setupPage() {

    class Numbers extends HTMLElement {
        constructor() {
            super();
            this.template = numbersTemplate;
        }

        connectedCallback() {
            components.loadResource(this)
                .then((result) => {
                    this.template = result.template;
                    components.renderOnce(this);
                })
                .catch(err => console.error(err));
        }
    }

    class Number extends HTMLElement {
        constructor() {
            super();
            this.template = numberTemplate;
        }

        connectedCallback() {
            const type = this.params.type;
            this.model = NumbersModel[type];

            components.loadResource(this)
                .then((result) => {
                    this.template = result.template;
                    this.template.textContent = this.model.join(',');
                    components.renderOnce(this);
                })
                .catch(err => console.error(err));
        }
    }

    class Vowels extends HTMLElement {
        constructor() {
            super();
            this.template = vowelsTemplate;
        }

        connectedCallback() {
            components.loadResource(this)
                .then((result) => {
                    this.template = result.template;
                    components.renderOnce(this);
                })
                .catch(err => console.error(err));
        }
    }

    class Consonant extends HTMLElement {
        constructor() {
            super();
            this.template = consonantTemplate;
        }

        connectedCallback() {
            components.loadResource(this)
                .then((result) => {
                    this.template = result.template;
                    components.renderOnce(this);
                })
                .catch(err => console.error(err));
        }
    }

    class Home extends HTMLElement {
        constructor() {
            super();
            this.template = homeTemplate;
        }

        connectedCallback() {
            components.loadResource(this)
                .then((result) => {
                    this.template = result.template;
                    components.renderOnce(this);
                })
                .catch(err => console.error(err));
        }
    }

    class NotFound extends HTMLElement {
        constructor() {
            super();
            this.template = notFoundTemplate;
        }

        connectedCallback() {
            components.loadResource(this)
                .then((result) => {
                    this.template = result.template;
                    components.renderOnce(this);
                })
                .catch(err => console.error(err));
        }
    }

    components.defineCustomElement('numbers-page', Numbers);
    components.defineCustomElement('number-page', Number);
    components.defineCustomElement('home-page', Home);
    components.defineCustomElement('not-found-page', NotFound);
    components.defineCustomElement('consonant-page', Consonant);
    components.defineCustomElement('vowel-page', Vowels);

    const lettersRouter = new Router({
        '/vowel': 'vowel-page',
        '/consonant': 'consonant-page',
    });

    let router = new Router({
        '/': 'home-page',
        '/numbers': 'numbers-page',
        '/documentation': '<div class="documentation">Documentation<div>',
        '/numbers/:type': 'number-page',
        '/letters/:type': lettersRouter,
        '**': 'not-found-page'
    }, browserHistory, beforeUnload);
}

const routeIdToPageMap = {
    'home': 'home-page',
    'numbers': 'numbers-page',
    'whole': 'number-page',
    'rational': 'number-page',
    'vowel': 'vowel-page',
    'consonant': 'consonant-page',
    'missing': 'not-found-page',
};

function createAsyncSpec(callback, time = 1000) {
    return new Promise(resolve => {
        setTimeout(() => {
            callback();
            resolve();
        }, time);
    });
}

function setupRouterTestPage() {
    const el = document.createElement('div');
    el.innerHTML = template;
    el.className = 'router-test-wrapper';

    let currentElement = document.querySelector('.router-test-wrapper');

    if (currentElement) {
        currentElement.parentElement.removeChild(currentElement);
    }

    document.body.appendChild(el);

    setupPage();
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

describe('Router Component', () => {
    afterAll(() => {
        // Since we don't want to replace the whole content of the body using
        // innerHtml setter, we query only the current custom element and we replace
        // it with a new one; this is needed because the specs are executed in a random
        // order and sometimes the component might be left in a state that is not
        // ready for testing
        let currentElement = document.querySelector('.router-test-wrapper');

        if (currentElement) {
            currentElement.parentElement.removeChild(currentElement);
        }
    });

    beforeEach(function (done) {
        setupRouterTestPage().then(done).catch(err => console.errror(err));
    }, 3000);

    it('Should be rendered', async () => {
        assert(document.querySelector('gameface-route') !== null, 'The router component is not rendered.');
    });

    it('Should show home', async () => {
        click(document.getElementById("home"));
        return createAsyncSpec(() => {
            assert(document.querySelector(routeIdToPageMap['home']) !== null, `Current page is not "home".`);
        });
    });

    it('Should show documentation page that is not a component', async () => {
        click(document.getElementById("documentation"));
        return createAsyncSpec(() => {
            assert(document.querySelector('.documentation')!== null, `Current page is not "documentation".`);
        });
    });

    it('Should show not found page', async () => {
        click(document.getElementById("missing"));
        return createAsyncSpec(() => {
            assert(document.querySelector(routeIdToPageMap['missing']) !== null, `Current page is not "missing".`);
        });
    });

    it('Should show numbers', async () => {
        click(document.getElementById("numbers"));
        return createAsyncSpec(() => {
            assert(document.querySelector(routeIdToPageMap['numbers']) !== null, `Current page is not "numbers"`);
        });
    });

    it('Should show whole numbers', async () => {
        click(document.getElementById("numbers"));
        return createAsyncSpec(() => {
            click(document.getElementById("whole"));
            assert(document.querySelector(routeIdToPageMap['whole']) !== null, 'Current page is not "whole".');
        }).then(() => {
            return createAsyncSpec(() => {
                assert(document.querySelector(routeIdToPageMap['whole']).textContent === NumbersModel.whole.join(','), 'Page "/whole" content is not correct; perhaps it failed to render.');
            });
        });
    });

    it('Should show rational numbers', async () => {
        click(document.getElementById("numbers"));
        await createAsyncSpec(() => {
            click(document.getElementById("rational"));
            assert(document.querySelector(routeIdToPageMap['rational']) !== null, 'Current page is not "rational".');
        }) 
        return createAsyncSpec(() => {
            assert(document.querySelector(routeIdToPageMap['rational']).textContent === NumbersModel.rational.join(','), 'Page "/rational" content is not correct; perhaps it failed to render.');
        });
    });

    it('Should show vowel page', async () => {
        click(document.getElementById("vowel"));
        return createAsyncSpec(() => {
            assert(document.querySelector(routeIdToPageMap['vowel']) !== null, 'Current page is not "vowel".');
        })
    });

    it('Should show consonant page', async () => {
        click(document.getElementById("consonant"));
        return createAsyncSpec(() => {
            assert(document.querySelector(routeIdToPageMap['consonant']) !== null, 'Current page is not "consonant".');
        })
    });

    xit('Should show warning on back', async () => {
        click(document.getElementById("home"));
        click(document.getElementById("numbers"));
        click(document.getElementById("vowel"));

        await createAsyncSpec(() => {
            history.back();
        });
        click(document.querySelector('.confirmButton'));
        return createAsyncSpec(() => {
            assert(history.state.current === '/numbers', 'Current history state is not "/numbers".');
        });
    });

    xit('Should show warning on forward', async (done) => {
        click(document.getElementById("home"));
        click(document.getElementById("numbers"));
        click(document.getElementById("vowel"));

        await createAsyncSpec(() => {
            history.back();
        });

        await createAsyncSpec(() => {
            click(document.querySelector('.confirmButton'));
            history.forward();
        })
        click(document.querySelector('.confirmButton'));
        return createAsyncSpec(() => {
            assert(history.state.current === '/letters/vowel', 'Current history state is not "/letters/vowel".');
        }, 1000);
    });

    xit('Should navigate to fallback route using pushState', async (done) => {
        const state = { current: '/wrongpath', id: browserHistory.currentRouteId };
        const title = 'wrongpath';
        browserHistory.pushState(state, title, '/wrongpath');

        return createAsyncSpec(() => {
            assert(history.state.current === '/wrongpath', 'Current history state is not "/wrongpath".');
            assert(document.querySelector('router-view').textContent === `Can't find this page.`, 'Current page "/wrongpath" content is not correct; perhaps it failed to render.');
        });
    });
});