/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import keyboard from './lib_components/keyboard';
import gamepad from './lib_components/gamepad';
import actions from './lib_components/actions';
import spatialNavigation from './lib_components/spatial-navigation';
import draggable from './lib_components/draggable';
import dropzone from './lib_components/dropzone';
import rotate from './lib_components/rotate';
import resize from './lib_components/resize';
import zoom from './lib_components/zoom';
import touchGestures from './lib_components/touch-gestures';

import IM from './utils/global-object';

IM.init();

export { keyboard, gamepad, actions, spatialNavigation, draggable, dropzone, rotate, resize, zoom, touchGestures };
