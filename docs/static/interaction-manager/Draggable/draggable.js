var draggable = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // interaction-manager/src/utils/drag-base.js
  var DragBase, drag_base_default;
  var init_drag_base = __esm({
    "interaction-manager/src/utils/drag-base.js"() {
      DragBase = class {
        constructor(options) {
          this.draggableElements = [];
          this.draggedElement = null;
          this.enabled = false;
          this.onMouseDown = this.onMouseDown.bind(this);
          this.onMouseMove = this.onMouseMove.bind(this);
          this.onMouseUp = this.onMouseUp.bind(this);
          this.options = options;
        }
        get draggedItemIndex() {
          return [...this.draggableElements].indexOf(this.draggedElement);
        }
        get bodyScrollOffset() {
          return {
            x: document.body.scrollLeft,
            y: document.body.scrollTop
          };
        }
      };
      drag_base_default = DragBase;
    }
  });

  // interaction-manager/src/utils/utility-functions.js
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  function createHash() {
    return (Math.random() + 1).toString(36).substring(7);
  }
  var init_utility_functions = __esm({
    "interaction-manager/src/utils/utility-functions.js"() {
    }
  });

  // interaction-manager/src/utils/global-object.js
  var IM, global_object_default;
  var init_global_object = __esm({
    "interaction-manager/src/utils/global-object.js"() {
      IM = class {
        constructor() {
          this.actions = [];
          this.keyboardFunctions = [];
          this.gamepadFunctions = [];
        }
        init() {
          if (!window._IM)
            window._IM = new IM();
        }
        getKeys(keys) {
          return _IM.keyboardFunctions.filter((keyFunction) => keyFunction.keys.every((key) => keys.includes(key)));
        }
        getKeysIndex(keys) {
          return _IM.keyboardFunctions.findIndex((keyFunction) => keyFunction.keys.every((key) => keys.includes(key)));
        }
        getGamepadAction(actions) {
          return _IM.gamepadFunctions.find((gpFunc) => gpFunc.actions.every((action) => actions.includes(action)));
        }
        getGamepadActionIndex(actions) {
          return _IM.gamepadFunctions.findIndex((gpFunc) => gpFunc.actions.every((action) => actions.includes(action)));
        }
        getAction(action) {
          return _IM.actions.find((actionObj) => actionObj.name === action);
        }
        getActionIndex(action) {
          return _IM.actions.findIndex((actionObj) => actionObj.name === action);
        }
      };
      global_object_default = new IM();
    }
  });

  // interaction-manager/src/lib_components/actions.js
  var Actions, actions_default;
  var init_actions = __esm({
    "interaction-manager/src/lib_components/actions.js"() {
      init_global_object();
      Actions = class {
        register(action, callback) {
          if (global_object_default.getAction(action))
            return console.error(`The following action "${action}" is already registered!`);
          _IM.actions.push({ name: action, callback });
        }
        remove(action) {
          const actionIndex = global_object_default.getActionIndex(action);
          if (actionIndex === -1)
            return console.error(`${action} is not a registered action!`);
          _IM.actions.splice(actionIndex, 1);
        }
        execute(action, value) {
          const actionObject = global_object_default.getAction(action);
          if (!actionObject)
            return console.error(`${action} is not a registered action!`);
          actionObject.callback(value);
        }
      };
      actions_default = new Actions();
    }
  });

  // interaction-manager/src/lib_components/draggable.js
  var AXIS, Draggable, draggable_default;
  var init_draggable = __esm({
    "interaction-manager/src/lib_components/draggable.js"() {
      init_drag_base();
      init_utility_functions();
      init_actions();
      AXIS = ["x", "y"];
      Draggable = class extends drag_base_default {
        constructor(options) {
          super(options);
          const hash = createHash();
          this.actionName = `drag-around-${hash}`;
          this.restrict = {
            top: 0,
            left: 0,
            right: Infinity,
            bottom: Infinity
          };
          this.init();
        }
        init() {
          if (this.enabled)
            return;
          this.draggableElements = document.querySelectorAll(this.options.element);
          if (this.draggableElements.length === 0) {
            return console.error(`${this.options.element} is not a valid element selector.`);
          }
          this.draggableElements.forEach((element) => element.addEventListener("mousedown", this.onMouseDown));
          this.registerDragActions();
          this.enabled = true;
        }
        deinit() {
          if (!this.enabled)
            return;
          this.enabled = false;
          this.draggableElements.forEach((element) => element.removeEventListener("mousedown"), this.onMouseDown);
          this.removeDragActions();
        }
        onMouseDown(event) {
          this.draggedElement = event.currentTarget;
          this.draggedElement.style.position = "absolute";
          this.elementRect = this.draggedElement.getBoundingClientRect();
          this.setRestriction();
          this.options.dragClass && this.draggedElement.classList.add(this.options.dragClass);
          this.options.onDragStart && this.options.onDragStart(this.draggedElement);
          document.addEventListener("mousemove", this.onMouseMove);
          document.addEventListener("mouseup", this.onMouseUp);
        }
        onMouseMove(event) {
          actions_default.execute(this.actionName, {
            x: event.clientX + this.bodyScrollOffset.x,
            y: event.clientY + this.bodyScrollOffset.y,
            index: this.draggedItemIndex
          });
        }
        onMouseUp() {
          document.removeEventListener("mousemove", this.onMouseMove);
          document.removeEventListener("mouseup", this.onMouseUp);
          this.options.onDragEnd && this.options.onDragEnd(this.draggedElement);
          this.options.dragClass && this.draggedElement.classList.remove(this.options.dragClass);
          this.draggedElement = null;
        }
        registerDragActions() {
          actions_default.register(this.actionName, ({ x, y, index }) => {
            if (!this.draggableElements[index])
              return console.error(`There is no draggable element at index ${index}`);
            if (this.options.lockAxis && AXIS.includes(this.options.lockAxis)) {
              x = this.options.lockAxis === "y" ? this.elementRect.x : x;
              y = this.options.lockAxis === "x" ? this.elementRect.y : y;
            }
            this.draggableElements[index].style.left = `${clamp(x, this.restrict.left, this.restrict.right)}px`;
            this.draggableElements[index].style.top = `${clamp(y, this.restrict.top, this.restrict.bottom)}px`;
            this.options.onDragMove && this.options.onDragMove({ x, y });
          });
        }
        removeDragActions() {
          actions_default.remove(this.actionName);
        }
        setRestriction() {
          if (!this.options.restrictTo)
            return;
          const restrictTo = document.querySelector(this.options.restrictTo);
          if (!restrictTo) {
            return console.error(`The element ${this.options.restrictTo} you trying to restrict dragging to is not a valid element`);
          }
          const { x, y, height, width } = restrictTo.getBoundingClientRect();
          this.restrict = {
            top: y,
            left: x,
            right: width + x - this.elementRect.width,
            bottom: height + y - this.elementRect.height
          };
        }
      };
      draggable_default = Draggable;
    }
  });

  // interaction-manager/src/draggable.js
  var require_draggable = __commonJS({
    "interaction-manager/src/draggable.js"(exports, module) {
      init_draggable();
      init_global_object();
      global_object_default.init();
      module.exports = draggable_default;
    }
  });
  return require_draggable();
})();
