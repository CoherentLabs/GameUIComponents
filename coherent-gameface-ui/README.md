Game UI Components Suite

This a bundle of all [Game UI Components](https://coherentlabs.github.io/GameUIComponents/en/) available for the browser and [Gameface](https://coherent-labs.com/products/coherent-gameface/).

Installation
=============

via npm:

```
npm i coherent-gameface-ui
```

Usage
=============

## Exported Variables

These are the variables that 'coherent-gameface-ui' exports

Components\
[Checkbox](https://coherentlabs.github.io/GameUIComponents/en/examples/checkbox/)\
[Switch](https://coherentlabs.github.io/GameUIComponents/en/examples/switch/)\
[GamefaceDropdown](https://coherentlabs.github.io/GameUIComponents/en/examples/dropdown/)\
[GamefaceFormControl](https://coherentlabs.github.io/GameUIComponents/en/components/form-control/)\
[Modal](https://coherentlabs.github.io/GameUIComponents/en/examples/modal/)\
[ProgressBar](https://coherentlabs.github.io/GameUIComponents/en/examples/progress-bar/)\
[RadialMenu](https://coherentlabs.github.io/GameUIComponents/en/examples/radial-menu/)\
[GamefaceRadioGroup](https://coherentlabs.github.io/GameUIComponents/en/examples/radio-button/)\
[Rangeslider](https://coherentlabs.github.io/GameUIComponents/en/examples/rangeslider/)\
[ScrollableContainer](https://coherentlabs.github.io/GameUIComponents/en/examples/scrollable-container/)\
[Slider](https://coherentlabs.github.io/GameUIComponents/en/examples/slider/)\
[Stepper](https://coherentlabs.github.io/GameUIComponents/en/examples/stepper/)\
[IEManager](https://coherentlabs.github.io/GameUIComponents/en/interaction-manager/installation/)\
[Tooltip](https://coherentlabs.github.io/GameUIComponents/en/examples/tooltip/)\
[TextField](https://coherentlabs.github.io/GameUIComponents/en/examples/text-field/)\
[Tabs, TabHeading, TabPanel](https://coherentlabs.github.io/GameUIComponents/en/examples/tabs/)\
[AccordionMenu, AccordionPanel, AccordionHeader, AccordionContent](https://coherentlabs.github.io/GameUIComponents/en/examples/accordion-menu/)\
[Router, Route, BrowserHistory, HashHistory](https://coherentlabs.github.io/)\
[GamefaceMenu, GamefaceLeftMenu, GamefaceBottomMenu, GamefaceRightMenu](https://coherentlabs.github.io/GameUIComponents/en/examples/menu/)\

Import all components that you need to use:

```js
import {
    Checkbox,
    Switch,
    Menu,
    Dropdown,
    Rangeslider,
} from 'coherent-gameface-ui';
```

if you don't need to access an exported variable - import all:

```
import 'coherent-gameface-ui';
```

## Importing the Styles

Make sure to load the styles of each component that you've imported:

```html
<link rel="stylesheet" href="../node_modules/coherent-gameface-ui/node_modules/coherent-gameface-switch/style.css">
```

## Using the Bundles

To use directly in the browser without bundling - use the bundles in the `node_modules` folder:

```html
<script src="node_modules/coherent-gameface-ui/node_modules/coherent-gameface-switch/dist/switch.development.js"></script>
```
