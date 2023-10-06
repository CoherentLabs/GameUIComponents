const loadGrid = (template) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'test-wrapper';
    wrapper.innerHTML = template;

    cleanTestPage('.test-wrapper');

    document.body.appendChild(wrapper);

    return new Promise((resolve) => {
        waitForStyles(resolve);
    });
};

const dragItemSim = (cell1, cell2) => {
    const step = 3000 / 60;

    const { x: startX, y: startY } = cell1.getBoundingClientRect();
    const { x: endX, y: endY } = cell2.getBoundingClientRect();

    const stepX = (endX - startX) / step;
    const stepY = (endY - startY) / step;

    const element = cell1.firstChild;

    element.dispatchEvent(new MouseEvent('mousedown', { clientX: startX, clientY: startY }));

    return new Promise((resolve) => {
        const moveItem = (x, y) => {
            x += (x.toFixed(1) !== endX.toFixed(1)) !== endX ? stepX : 0;
            y += (y.toFixed(1) !== endY.toFixed(1)) !== endY ? stepY : 0;

            document.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: y }));

            if (x.toFixed(1) !== endX.toFixed(1) || y.toFixed(1) !== endY.toFixed(1)) {
                requestAnimationFrame(() => moveItem(x, y));
                return;
            }

            resolve();
        };

        requestAnimationFrame(() => moveItem(startX, startY));
    });
};

// eslint-disable-next-line max-lines-per-function
describe('Automatic grid component', () => {
    const template = `
    <gameface-automatic-grid class="automatic-grid-component" columns="7" rows="5" draggable>
        <component-slot data-name="item" col="3" row="2" class="box">1</component-slot>
        <component-slot data-name="item" col="3" row="2" class="box">2</component-slot>
        <component-slot data-name="item" col="8" row="8" class="box">3</component-slot>
        <component-slot data-name="item" class="box">4</component-slot>
        <component-slot data-name="item" class="box">5</component-slot>
        <component-slot data-name="item" class="box">6</component-slot>
    </gameface-automatic-grid>`;

    afterEach(() => cleanTestPage('.test-wrapper'));

    it('Should create the correct number of columns', async () => {
        await loadGrid(template);
        const columns = document.querySelector('.guic-row').childElementCount;

        assert.equal(columns, 7);
    });

    it('Should create the correct number of rows', async () => {
        await loadGrid(template);
        const rows = document.querySelectorAll('.guic-row').length;

        assert.equal(rows, 5);
    });

    it('Should position items in correct cell', async () => {
        await loadGrid(template);
        const cell = document.querySelectorAll('.guic-automatic-grid-cell')[9];

        assert.notEqual(cell.childElementCount, 0);
    });

    it('Should move items when dragged to another cell', (done) => {
        loadGrid(template).then(() => {
            const cells = document.querySelectorAll('.guic-automatic-grid-cell');

            const cell1 = cells[1];
            const cell2 = cells[cells.length - 1];

            assert.equal(cell1.childElementCount, 1);
            assert.equal(cell2.childElementCount, 0);

            dragItemSim(cell1, cell2).then(() => {
                document.querySelector('gameface-automatic-grid').dragEnd({ target: cell2 });

                assert.equal(cell1.childElementCount, 0);
                assert.equal(cell2.childElementCount, 1);

                done();
            });
        });
    });
});

/* global engine */
/* global setupDataBindingTest */
if (engine?.isAttached) {
    describe('Automatic Grid Component (Gameface Data Binding Test)', () => {
        const templateName = 'model';

        const template = `
        <div data-bind-for="array:{{${templateName}.array}}">
            <gameface-automatic-grid class="automatic-grid-component" columns="7" rows="5" draggable>
                <component-slot data-name="item" col="3" row="2" class="box">1</component-slot>
                <component-slot data-name="item" col="3" row="2" class="box">2</component-slot>
                <component-slot data-name="item" class="box">4</component-slot>
                <component-slot data-name="item" class="box">5</component-slot>
        </gameface-automatic-grid>
        </div>`;

        afterAll(() => cleanTestPage('.test-wrapper'));

        beforeEach(async () => {
            await setupDataBindingTest(templateName, template, loadGrid);
        });

        it(`Should have populated 2 elements`, () => {
            const expectedCount = 2;
            const automaticGridCount = document.querySelectorAll('gameface-automatic-grid').length;
            assert.equal(automaticGridCount, expectedCount, `Automatic Grids found: ${automaticGridCount}, should have been ${expectedCount}.`);
        });
    });
}
