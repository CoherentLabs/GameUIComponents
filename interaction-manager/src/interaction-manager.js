import keyboard from './lib_components/keyboard';
import gamepad from './lib_components/gamepad';
import actions from './lib_components/actions';
import spatialNavigation from './lib_components/spatial-navigation';

import IM from './utils/global-object';

IM.init();

export { keyboard, gamepad, actions, spatialNavigation };
