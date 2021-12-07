/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Router, Route, BrowserHistory, HashHistory } from '../node_modules/coherent-gameface-router/umd/router.development.js';

const NumbersModel = {
    'whole': [1, 2, 3, 4, 5, 6, -7],
    'rational': [1.5, 1.4, -2.3]
};

const template = `<div class="router-wrapper">
<gameface-route id="home" to="/">Home</gameface-route>
<gameface-route id="documentation" to="/documentation">Documentation</gameface-route>
<gameface-route id="numbers" activeClass="red" to="/numbers">Numbers</gameface-route>
<gameface-route id="vowel" to="/letters/vowel">Vowels</gameface-route>
<gameface-route activeClass="active-link" id="consonant" to="/letters/consonant">Consonant</gameface-route>
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
        confirmationDialog.removeChild(confirmButton);
        confirmationDialog.parentElement.removeChild(confirmationDialog);
        confirmButton.style.display = 'none';
        callback.apply(null, params);
    }

    confirmationDialog.appendChild(confirmButton);
    document.body.appendChild(confirmationDialog);

    return false;
}

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
}

const routerHistories = {
    BROWSER: new BrowserHistory(),
    HASH: new HashHistory()
}

let lettersRouter = null, router = null, currentHistory = null;

function clearPreviousRouter() {
    if (lettersRouter && router && currentHistory) {
        lettersRouter.clear();
        router.clear();
        lettersRouter = null;
        router = null;
        currentHistory = null;
    }
}

function setupRouter(history = routerHistories.BROWSER, confirmation = false) {
    clearPreviousRouter();

    currentHistory = history;
    Route.use(currentHistory);

    lettersRouter = new Router({
        '/vowel': 'vowel-page',
        '/consonant': 'consonant-page',
    });

    router = new Router({
        '/': 'home-page',
        '/numbers': 'numbers-page',
        '/documentation': '<div class="documentation">Documentation<div>',
        '/numbers/:type': 'number-page',
        '/letters/:type': lettersRouter,
        '**': 'not-found-page'
    }, currentHistory, confirmation ? beforeUnload : null);
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

function setupRouterTestPage(history = routerHistories.BROWSER, confirmation = false) {
    const el = document.createElement('div');
    el.innerHTML = template;
    el.className = 'router-test-wrapper';

    let currentElement = document.querySelector('.router-test-wrapper');

    if (currentElement) {
        currentElement.parentElement.removeChild(currentElement);
    }

    document.body.appendChild(el);

    setupPage();
    setupRouter(history, confirmation);
    return new Promise(resolve => {
        components.waitForFrames(() => {
            resolve();
        }, 2)
    });
}

async function navigateTo(pageName, confirm) {
    return await createAsyncSpec(() => {
        click(document.getElementById(pageName));
        if (confirm) click(document.querySelector('.confirmButton'));
    });
}

function testSuite(title = 'Router Component', routerHistory = routerHistories.BROWSER, confirmation = false) {
    describe(title, () => {
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
            setupRouterTestPage(routerHistory, confirmation).then(done).catch(err => console.error(err));
        });

        it('Should be rendered', async () => {
            return assert(document.querySelector('gameface-route') !== null, 'The router component is not rendered.');
        });

        it('Should show home', async () => {
            await navigateTo('home', confirmation);

            return createAsyncSpec(() => {
                assert(document.querySelector(routeIdToPageMap['home']) !== null, `Current page is not "home".`);
            });
        });

        it('Should show documentation page that is not a component', async () => {
            await navigateTo('documentation', confirmation);

            return createAsyncSpec(() => {
                assert(document.querySelector('.documentation') !== null, `Current page is not "documentation".`);
            });
        });

        it('Should show not found page', async () => {
            await navigateTo('missing', confirmation);

            return createAsyncSpec(() => {
                assert(document.querySelector(routeIdToPageMap['missing']) !== null, `Current page is not "missing".`);
            });
        });

        it('Should show numbers', async () => {
            await navigateTo('numbers', confirmation);

            return createAsyncSpec(() => {
                assert(document.querySelector(routeIdToPageMap['numbers']) !== null, `Current page is not "numbers"`);
            });
        });

        it('Should show whole numbers', async () => {
            await navigateTo('numbers', confirmation);
            await navigateTo('whole', confirmation);

            return createAsyncSpec(() => {
                assert(document.querySelector(routeIdToPageMap['whole']) !== null, 'Current page is not "whole".');
                assert(document.querySelector(routeIdToPageMap['whole']).textContent === NumbersModel.whole.join(','), 'Page "/whole" content is not correct; perhaps it failed to render.');
            });
        });

        it('Should show rational numbers', async () => {
            await navigateTo('numbers', confirmation);
            await navigateTo('rational', confirmation);

            return createAsyncSpec(() => {
                assert(document.querySelector(routeIdToPageMap['rational']) !== null, 'Current page is not "rational".');
                assert(document.querySelector(routeIdToPageMap['rational']).textContent === NumbersModel.rational.join(','), 'Page "/rational" content is not correct; perhaps it failed to render.');
            });
        });

        it('Should show vowel page', async () => {
            await navigateTo('vowel', confirmation);

            return createAsyncSpec(() => {
                assert(document.querySelector(routeIdToPageMap['vowel']) !== null, 'Current page is not "vowel".');
            });
        });

        it('Should show consonant page', async () => {
            await navigateTo('consonant', confirmation);

            return createAsyncSpec(() => {
                assert(document.querySelector(routeIdToPageMap['consonant']) !== null, 'Current page is not "consonant".');
            });
        });

        it('Should automatically add active-link class to consonant page route element', async () => {
            await navigateTo('consonant', confirmation);

            return createAsyncSpec(() => {
                assert(document.querySelector('gameface-route[to="/letters/consonant"]').classList.contains('active-link') === true, 'Active class name was not added.');
            })
        });

        it('Should automatically remove active-link class to consonant page route element', async () => {
            await navigateTo('consonant', confirmation);
            await navigateTo('vowel', confirmation);

            return createAsyncSpec(() => {
                assert(document.querySelector('gameface-route[to="/letters/consonant"]').classList.contains('active-link') === false, 'Active class name was not removed.');
            })
        });

        xit('Should show warning on back', async () => {
            await navigateTo('home', confirmation);

            await createAsyncSpec(() => {
                assert(document.querySelector(routeIdToPageMap['home']) !== null, 'Current page is not "home".');
            });

            await navigateTo('numbers', confirmation);

            await createAsyncSpec(() => {
                assert(document.querySelector(routeIdToPageMap['numbers']) !== null, 'Current page is not "numbers".');
            });

            await navigateTo('vowel', confirmation);

            await createAsyncSpec(() => {
                assert(document.querySelector(routeIdToPageMap['vowel']) !== null, 'Current page is not "vowel".');
                history.back();
            });

            return createAsyncSpec(async () => {
                if (confirmation) click(document.querySelector('.confirmButton'));
                assert(document.querySelector(routeIdToPageMap['numbers']) !== null, 'Current page is not "numbers".');
            });
        });

        xit('Should show warning on forward', async () => {
            await navigateTo('home', confirmation);
            await navigateTo('numbers', confirmation);
            await navigateTo('vowel', confirmation);

            await createAsyncSpec(() => {
                history.back();
            });

            await createAsyncSpec(() => {
                if (confirmation) click(document.querySelector('.confirmButton'));
            })

            await createAsyncSpec(() => {
                history.forward();
            });

            await createAsyncSpec(() => {
                if (confirmation) click(document.querySelector('.confirmButton'));
            })

            return createAsyncSpec(() => {
                assert(document.querySelector(routeIdToPageMap['vowel']) !== null, 'Current page is not "vowel".');
            });
        });

        xit('Should navigate to fallback route using pushState', async () => {
            const state = { current: '/', id: currentHistory.currentRouteId };
            const title = 'home';
            Route.history.pushState(state, title, '/');

            return createAsyncSpec(() => {
                if (confirmation) click(document.querySelector('.confirmButton'));

                assert(document.querySelector(routeIdToPageMap['home']) !== null, 'Current page is not "home".');
            });
        });

        it('Should use the activeClass set to the parent element', async () => {
            await navigateTo('documentation', confirmation);
            return createAsyncSpec(() => {
                assert(document.getElementById('documentation').classList.contains('gameface-route-active'), true);
            });
        });

        it('Should use the activeClass set to the element', async () => {
            await navigateTo('numbers', confirmation);
            return createAsyncSpec(() => {
                assert(document.getElementById('numbers').classList.contains('red'), true);
            });
        });

        it('Should use the activeClass set to the parent element', async () => {
            document.querySelector('.router-wrapper').setAttribute('activeClass', 'green');
            await navigateTo('documentation', confirmation);
            return createAsyncSpec(() => {
                assert(document.getElementById('documentation').classList.contains('green'), true);
            });
        });
    });
}

for (let key of Object.keys(routerHistories)) {
    testSuite(`Router Component - ${key.toLowerCase()}`, routerHistories[key]);
    testSuite(`Router Component - ${key.toLowerCase()} with confirmation button`, routerHistories[key], true);
}
