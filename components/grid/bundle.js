/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./components/grid/demo/demo.js":
/*!**************************************!*\
  !*** ./components/grid/demo/demo.js ***!
  \**************************************/
/***/ (function() {

eval("/* eslint-disable no-invalid-this */\r\n/*---------------------------------------------------------------------------------------------\r\n *  Copyright (c) Coherent Labs AD. All rights reserved.\r\n *  Licensed under the MIT License. See License.txt in the project root for license information.\r\n *--------------------------------------------------------------------------------------------*/\r\n\r\n(() => {\r\n    this.current = 0;\r\n\r\n    this.showDetails = (e) => {\r\n        const targetId = e.currentTarget.dataset.id;\r\n\r\n        if (this.current) {\r\n            document.querySelector(`.avatar${this.current}`).classList.remove('selected');\r\n            document.querySelector(`#avatar${this.current}-classes`).style.display = 'none';\r\n        }\r\n\r\n        this.current = targetId;\r\n        document.querySelector(`.avatar${this.current}`).classList.add('selected');\r\n        document.querySelector(`#avatar${this.current}-classes`).style.display = 'flex';\r\n    };\r\n\r\n\r\n    this.deselectAllClasses = () => {\r\n        const classes = document.getElementsByClassName('class');\r\n        for (let i = 0; i < classes.length; i++) {\r\n            classes[i].classList.remove('active');\r\n        }\r\n    };\r\n\r\n    this.selectClass = (e) => {\r\n        this.deselectAllClasses();\r\n        const target = e.currentTarget;\r\n        target.classList.add('active');\r\n    };\r\n\r\n    const avatars = document.getElementsByClassName('avatar');\r\n    for (let i = 0; i < avatars.length; i++) {\r\n        avatars[i].addEventListener('click', this.showDetails);\r\n    }\r\n\r\n    const classes = document.getElementsByClassName('class');\r\n    for (let i = 0; i < classes.length; i++) {\r\n        classes[i].addEventListener('click', this.selectClass);\r\n    }\r\n})();\r\n\n\n//# sourceURL=webpack://gameuicomponents/./components/grid/demo/demo.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./components/grid/demo/demo.js"]();
/******/ 	
/******/ })()
;