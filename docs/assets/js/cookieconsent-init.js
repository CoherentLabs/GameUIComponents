const cc = initCookieConsent();

// configuration
cc.run({
    current_lang: 'en',
    autoclear_cookies: true,
    page_scripts: true,
    hide_from_bots: true,
    // Even though _ga cookie has 2 years of expiration date
    // (from the allowed 12 months according to GDPR/ePrivacy Directive),
    // the consent form will show again and if declined, the GA related cookies will be deleted.
    cookie_expiration: 356,
    cookie_necessary_only_expiration: 356,
    // See https://github.com/orestbida/cookieconsent#how-to-enablemanage-revisions
    // Left for future reference if we change the consent.
    // revision: 0,

    languages: {
        'en': {
            consent_modal: {
                title: 'We use cookies!',
                description: 'Hi, this website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it. The latter will be set only after consent. <button type="button" data-cc="c-settings" class="cc-link">Let me choose</button>',
                primary_btn: {
                    text: 'Accept all',
                    role: 'accept_all',
                },
                secondary_btn: {
                    text: 'Reject all',
                    role: 'accept_necessary',
                }
            },
            settings_modal: {
                title: 'Cookie preferences',
                save_settings_btn: 'Save settings',
                accept_all_btn: 'Accept all',
                reject_all_btn: 'Reject all',
                close_btn_label: 'Close',
                cookie_table_headers: [
                    {col1: 'Name'},
                    {col2: 'Domain'},
                    {col3: 'Expiration'},
                    {col4: 'Description'},
                ],
                blocks: [
                    {
                        title: 'Cookie usage 📢',
                        description: 'Cookies are used to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="https://coherentlabs.github.io/GameUIComponents/privacy-policy/" class="cc-link">privacy policy</a>.'
                    }, {
                        title: 'Strictly necessary cookies',
                        description: 'These cookies are essential for the proper functioning of my website. Without these cookies, the website may not work properly.',
                        toggle: {
                            value: 'necessary',
                            enabled: true,
                            readonly: true,
                        }
                    }, {
                        title: 'Performance and Analytics cookies',
                        description: 'These cookies allow the website to remember the choices you have made in the past.',
                        toggle: {
                            value: 'analytics',
                            enabled: false,
                            readonly: false,
                        },
                        cookie_table: [
                            {
                                col1: '^_ga',
                                col2: 'google.com',
                                col3: '2 years',
                                col4: 'This cookie is a Google Analytics persistent cookie.',
                                is_regex: true,
                            },
                            {
                                col1: '_gid',
                                col2: 'google.com',
                                col3: '1 day',
                                col4: 'This cookie is a Google Analytics persistent cookie.',
                            }
                        ]
                    }
                ]
            }
        }
    }
});
