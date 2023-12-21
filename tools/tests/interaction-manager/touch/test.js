/* eslint-disable new-cap */
/* eslint-disable max-lines-per-function */
/* global createIMElement, simulateTouch, timeout */

// All tests disabled until SUP-3279 is fixed
if (engine?.isAttached) {
    xdescribe('Tap', () => {
        beforeEach(async () => {
            await createIMElement();
        });

        afterEach(() => {
            cleanTestPage('.container');
        });

        it('should call the callback on single tap', async () => {
            const element = document.querySelector('.square');
            const tapTime = 200;

            let isTapped = false;

            interactionManager.touchGestures.tap({
                element,
                callback: () => {
                    isTapped = true;
                },
                tapTime,
            });

            simulateTouch(element, 'touchstart', { identifier: 0 });

            await timeout(() => {
                simulateTouch(element, 'touchend', { identifier: 0 });
            }, tapTime / 2);

            assert.isTrue(isTapped);
        });

        it('should call the callback on double tap', async () => {
            const element = document.querySelector('.square');
            const tapTime = 200;

            let isTapped = false;

            interactionManager.touchGestures.tap({
                element,
                callback: () => {
                    isTapped = true;
                },
                tapTime,
                tapNumber: 2,
            });

            simulateTouch(element, 'touchstart', { identifier: 0 });

            await timeout(() => {
                simulateTouch(element, 'touchend', { identifier: 0 });
            }, tapTime / 2);

            simulateTouch(element, 'touchstart', { identifier: 0 });

            await timeout(() => {
                simulateTouch(element, 'touchend', { identifier: 0 });
            }, tapTime / 2);

            assert.isTrue(isTapped);
        });
    });

    it('shouldn\'t call the callback on long tap', async () => {
        const element = document.querySelector('.square');
        const tapTime = 200;

        let isTapped = false;

        interactionManager.touchGestures.tap({
            element,
            callback: () => {
                isTapped = true;
            },
            tapTime,
        });

        simulateTouch(element, 'touchstart', {
            x: 0,
            y: 0,
            target: element,
            currentTarget: element,
            identifier: 0,
        });

        await timeout(() => {
            simulateTouch(element, 'touchend', { identifier: 0 });
        }, tapTime + 1);

        assert.isFalse(isTapped);
    });

    it('shouldn\'t call the callback when there is too much time between taps', async () => {
        const element = document.querySelector('.square');
        const tapTime = 200;
        const betweenTapsTime = 500;

        let isTapped = false;

        interactionManager.touchGestures.tap({
            element,
            callback: () => {
                isTapped = true;
            },
            tapTime,
        });

        simulateTouch(element, 'touchstart', { identifier: 0 });

        await timeout(() => {
            simulateTouch(element, 'touchend', { identifier: 0 });
        }, tapTime + 1);

        await timeout(() => {}, betweenTapsTime + 1);

        simulateTouch(element, 'touchstart', { identifier: 0 });

        await timeout(() => {
            simulateTouch(element, 'touchend', { identifier: 0 });
        }, tapTime + 1);

        assert.isFalse(isTapped);
    });

    xdescribe('Hold', () => {
        it('should call the callback on hold', async () => {
            const element = document.querySelector('.square');
            const time = 1000;

            let isHold = false;

            interactionManager.touchGestures.tap({
                element,
                callback: () => {
                    isHold = true;
                },
                time,
            });

            simulateTouch(element, 'touchstart', { identifier: 0 });

            await timeout(() => {}, time + 1);

            assert.isTrue(isHold);
        });

        it('shouldn\'t call the callback on short hold', async () => {
            const element = document.querySelector('.square');
            const time = 1000;

            let isHold = false;

            interactionManager.touchGestures.tap({
                element,
                callback: () => {
                    isHold = true;
                },
                time,
            });

            simulateTouch(element, 'touchstart', { identifier: 0 });

            await timeout(() => {
                simulateTouch(element, 'touchend', { identifier: 0 });
            }, time / 2);

            assert.isFalse(isHold);
        });
    });

    xdescribe('Drag', () => {
        it('should trigger the onDragStart callback', async () => {
            const element = document.querySelector('.square');
            const DRAG_CLASS = 'dragged';

            interactionManager.touchGestures.drag({
                element,
                onDragStart: () => {
                    element.classList.add(DRAG_CLASS);
                },
            });

            simulateTouch(element, 'touchstart', { identifier: 0 });

            assert.isTrue(element.classList.contains(DRAG_CLASS));
        });

        it('should trigger the onDragEnd callback', async () => {
            const element = document.querySelector('.square');
            const DRAG_CLASS = 'dragged';

            element.classList.add(DRAG_CLASS);

            interactionManager.touchGestures.drag({
                element,
                onDragEnd: () => {
                    element.classList.remove(DRAG_CLASS);
                },
            });

            simulateTouch(element, 'touchstart', { identifier: 0 });
            simulateTouch(element, 'touchend', { identifier: 0 });

            assert.isFalse(element.classList.contains(DRAG_CLASS));
        });

        it('should trigger the onDrag callback', async () => {
            const element = document.querySelector('.square');
            const DRAG_CLASS = 'dragged';

            interactionManager.touchGestures.drag({
                element,
                onDrag: () => {
                    element.classList.add(DRAG_CLASS);
                },
            });

            simulateTouch(element, 'touchstart', { identifier: 0 });
            simulateTouch(element, 'touchmove', { identifier: 0 });

            assert.isTrue(element.classList.contains(DRAG_CLASS));
        });
    });

    xdescribe('Swipe', () => {
        it('should trigger the callback on swipe', async () => {
            const element = document.querySelector('.square');

            let isSwiped = false;

            interactionManager.touchGestures.swipe({
                element,
                callback: () => {
                    isSwiped = true;
                },
            });

            simulateTouch(element, 'touchstart', { identifier: 0 });

            await timeout(() => {
                simulateTouch(element, 'touchend', { identifier: 0, x: 300, y: 0 });
            }, 500);

            assert.isTrue(isSwiped);
        });

        it('shouldn\'t trigger the callback on long swipe', async () => {
            const element = document.querySelector('.square');

            let isSwiped = false;

            interactionManager.touchGestures.swipe({
                element,
                callback: () => {
                    isSwiped = true;
                },
            });

            simulateTouch(element, 'touchstart', { identifier: 0 });

            await timeout(() => {
                simulateTouch(element, 'touchend', { identifier: 0, x: 300, y: 0 });
            }, 1500);

            assert.isFalse(isSwiped);
        });

        it('should trigger the callback on two finger swipe', async () => {
            const element = document.querySelector('.square');
            const touchNumber = 2;

            let isSwiped = false;

            interactionManager.touchGestures.swipe({
                element,
                callback: () => {
                    isSwiped = true;
                },
                touchNumber,
            });

            simulateTouch(element, 'touchstart', { identifier: 0 });
            simulateTouch(element, 'touchstart', { identifier: 1 });

            await timeout(() => {
                simulateTouch(element, 'touchend', { identifier: 0, x: 300, y: 0 });
                simulateTouch(element, 'touchend', { identifier: 1, x: 300, y: 0 });
            }, 500);

            assert.isTrue(isSwiped);
        });

        it('should return the correct direction', async () => {
            const element = document.querySelector('.square');
            const correctDirection = 'right';

            let direction = '';

            interactionManager.touchGestures.swipe({
                element,
                callback: (dir) => {
                    direction = dir;
                },
            });

            simulateTouch(element, 'touchstart', { identifier: 0 });

            await timeout(() => {
                simulateTouch(element, 'touchend', { identifier: 0, x: 300, y: 0 });
            }, 500);

            assert.equal(direction, correctDirection);
        });
    });

    xdescribe('Pinch', () => {
        it('should trigger the callback on pinch', async () => {
            const element = document.querySelector('.square');

            let isPinched = false;

            interactionManager.touchGestures.pinch({
                element,
                callback: () => {
                    isPinched = true;
                },
            });

            simulateTouch(element, 'touchstart', { identifier: 0, x: 0, y: 0 });
            simulateTouch(element, 'touchstart', { identifier: 1, X: 300, y: 300 });

            simulateTouch(element, 'touchmove', { identifier: 0, x: 150, y: 150 });
            simulateTouch(element, 'touchmove', { identifier: 1, x: 150, y: 150 });

            simulateTouch(element, 'touchend', { identifier: 0 });
            simulateTouch(element, 'touchend', { identifier: 1 });

            assert.isTrue(isPinched);
        });

        it('should get positive delta on stretch', async () => {
            const element = document.querySelector('.square');

            let delta;

            interactionManager.touchGestures.pinch({
                element,
                callback: ({ pinchDelta }) => {
                    delta = pinchDelta;
                },
            });

            simulateTouch(element, 'touchstart', { identifier: 0, x: 150, y: 150 });
            simulateTouch(element, 'touchstart', { identifier: 1, X: 150, y: 150 });

            simulateTouch(element, 'touchmove', { identifier: 0, x: 0, y: 0 });
            simulateTouch(element, 'touchmove', { identifier: 1, x: 300, y: 300 });

            simulateTouch(element, 'touchend', { identifier: 0 });
            simulateTouch(element, 'touchend', { identifier: 1 });

            assert.isAbove(delta, 0);
        });

        it('should get negative delta on pinch', async () => {
            const element = document.querySelector('.square');

            let delta;

            interactionManager.touchGestures.pinch({
                element,
                callback: ({ pinchDelta }) => {
                    delta = pinchDelta;
                },
            });

            simulateTouch(element, 'touchstart', { identifier: 0, x: 0, y: 0 });
            simulateTouch(element, 'touchstart', { identifier: 1, X: 300, y: 300 });

            simulateTouch(element, 'touchmove', { identifier: 0, x: 150, y: 150 });
            simulateTouch(element, 'touchmove', { identifier: 1, x: 150, y: 150 });

            simulateTouch(element, 'touchend', { identifier: 0 });
            simulateTouch(element, 'touchend', { identifier: 1 });

            assert.isBelow(delta, 0);
        });
    });

    xdescribe('Rotate', () => {
        it('should trigger the callback on rotate', async () => {
            const element = document.querySelector('.square');

            let isRotated = false;

            interactionManager.touchGestures.rotate({
                element,
                callback: () => {
                    isRotated = true;
                },
            });

            simulateTouch(element, 'touchstart', { identifier: 0, x: 150, y: 150 });
            simulateTouch(element, 'touchstart', { identifier: 1, X: 150, y: 150 });

            simulateTouch(element, 'touchmove', { identifier: 0, x: 0, y: 0 });
            simulateTouch(element, 'touchmove', { identifier: 1, x: 300, y: 300 });

            simulateTouch(element, 'touchend', { identifier: 0 });
            simulateTouch(element, 'touchend', { identifier: 1 });

            assert.isTrue(isRotated);
        });

        it('should change angle on rotate', async () => {
            const element = document.querySelector('.square');

            let newAngle;

            interactionManager.touchGestures.rotate({
                element,
                callback: (angle) => {
                    newAngle = angle;
                },
            });

            simulateTouch(element, 'touchstart', { identifier: 0, x: 0, y: 0 });
            simulateTouch(element, 'touchstart', { identifier: 1, X: 300, y: 300 });

            simulateTouch(element, 'touchmove', { identifier: 0, x: 0, y: 300 });
            simulateTouch(element, 'touchmove', { identifier: 1, x: 300, y: 0 });

            simulateTouch(element, 'touchend', { identifier: 0 });
            simulateTouch(element, 'touchend', { identifier: 1 });

            assert.isAbove(newAngle, 0);
        });
    });
}
