const tabs = document.querySelector('gameface-tabs');
tabs.selectTab(tabs.querySelector('tab-heading'));

function setupScrollbars() {
    const scrollableContainers = document.querySelectorAll('scrollable-container');

    for (let i = 0; i < scrollableContainers.length; i++) {
        const scrollableContainer = scrollableContainers[i];

        scrollableContainer.showScrollBar(scrollableContainer.scrollbar);
        const scrollableContent = scrollableContainer.querySelector('[name="scrollable-content"]')
        scrollableContainer.scrollbar.resize(scrollableContent);
        scrollableContainer.shouldShowScrollbar();
        scrollableContainer.hideScrollBar(scrollableContainer.scrollbar);
    }
}

setupScrollbars();

const menuItems = document.querySelectorAll('menu-item');
for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].addEventListener('click', (e) => {
        const panel = document.querySelector(`#${e.currentTarget.id}-panel`);
        const activePanel = document.querySelector('.active-panel');
        activePanel.classList.remove('active-panel');
        activePanel.classList.add('inactive-panel');
        panel.classList.add('active-panel');

        setupScrollbars();
    });
}