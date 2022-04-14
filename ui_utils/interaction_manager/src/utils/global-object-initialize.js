/**
 * Util function to create the global object to store actions and callbacks for keyboard and gamepad
 */
export default function globalObjectInitialize() {
    if (!window._IM) {
        window._IM = {
            actions: [],
            keyboardFunctions: [],
            gamepadFunctions: [],
        };
    }
}
