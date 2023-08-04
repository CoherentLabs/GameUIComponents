const componentsTemplates = {
    accordionMenu: '',
    automaticGrid: '',
    checkbox: '',
    dropdown: '',
    menu: '',
    modal: '',
    radioButton: '',
    rangeSlider: '',
    slider: '',
    switch: '',
    tabs: '',
    textField: '',
    tooltip: '',
    progressBar: '',
    radialMenu: '',
    scrollableContainer: '',
};

componentsTemplates.accordionMenu = `
<gameface-accordion-menu>
    <gameface-accordion-panel slot="accordion-panel" expanded>
        <gameface-accordion-header>Long Text</gameface-accordion-header>
        <gameface-accordion-content>Lorem</gameface-accordion-content>
    </gameface-accordion-panel>
</gameface-accordion-menu>
`;

componentsTemplates.automaticGrid = `
<gameface-automatic-grid class="automatic-grid-component" columns="3" rows="2" draggable>
    <component-slot data-name="item" col="3" row="1" class="box">1</component-slot>
    <component-slot data-name="item" col="3" row="2" class="box">2</component-slot>
    <component-slot data-name="item" class="box">4</component-slot>
    <component-slot data-name="item" class="box">5</component-slot>
</gameface-automatic-grid>
`;

componentsTemplates.checkbox = `
<gameface-checkbox class="checkbox-component">
    <component-slot data-name="checkbox-background">
        <div class="guic-checkbox-background"></div>
    </component-slot>
    <component-slot data-name="checkbox-label">
        <span class="guic-checkbox-label">Enable Music</span>
    </component-slot>
</gameface-checkbox>
`;

componentsTemplates.dropdown = `
<gameface-dropdown class="gameface-dropdown-component">
    <dropdown-option slot="option">Cat</dropdown-option>
    <dropdown-option slot="option">Dog</dropdown-option>
</gameface-dropdown>
`;

componentsTemplates.menu = `
<gameface-left-menu>
    <menu-item slot="menu-item">
        Settings
        <gameface-left-menu orientation="vertical">
            <menu-item slot="menu-item">Keyboard</menu-item>
            <menu-item slot="menu-item">Mouse</menu-item>
        </gameface-left-menu>
    </menu-item>
</gameface-left-menu>
`;

componentsTemplates.modal = `
<gameface-modal>
    <div slot="header">
        Modal Header
    </div>
    <div slot="body">
        <div class="confirmation-text">Confirmation Text</div>
    </div>
    <div slot="footer">
        <div class="actions">
            <button id="confirm" class="close guic-modal-button confirm controls">Yes</button>
            <button class="close guic-modal-button discard controls">No</button>
        </div>
    </div>
</gameface-modal>
`;

componentsTemplates.radioButton = `
<gameface-radio-group>
    <radio-button>Button 1</radio-button>
    <radio-button checked>Button 2</radio-button>
</gameface-radio-group>
`;

componentsTemplates.rangeSlider = `
<gameface-rangeslider orientation="horizontal" min="1" max="3" value="2" thumb></gameface-rangeslider>
`;

componentsTemplates.slider = `
<div class="standalone-slider">
    <gameface-slider class="horizontal-slider-component" orientation="horizontal"></gameface-slider>
</div>
`;

componentsTemplates.switch = `
<gameface-switch>
    <component-slot data-name="switch-unchecked">Off</component-slot>
    <component-slot data-name="switch-checked">On</component-slot>
</gameface-switch>
`;

componentsTemplates.tabs = `
<gameface-tabs>
    <tab-heading slot="tab">Chapter One</tab-heading>
    <tab-panel slot="panel">Chapter One Content</tab-panel>
    <tab-heading slot="tab">Chapter Two</tab-heading>
    <tab-panel slot="panel">Chapter Two Content</tab-panel>
</gameface-tabs>
`;

componentsTemplates.textField = `
<gameface-text-field type="text"
    value="Value"
    placeholder="Placeholder"
    label="Label:">
</gameface-text-field>
`;

componentsTemplates.tooltip = `
<gameface-tooltip target=".target" on="click" position="bottom" off="click">
    <div slot="message">Message</div>
</gameface-tooltip>
`;

componentsTemplates.progressBar = `<gameface-progress-bar></gameface-progress-bar>`;

componentsTemplates.radialMenu = `
<gameface-radial-menu
    data-name="Radial Menu Name"
    data-open-key-code="16">
</gameface-radial-menu>
`;

componentsTemplates.scrollableContainer = `
<gameface-scrollable-container class="scrollable-container-component-standalone">
    <component-slot data-name="scrollable-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu urna tempus, ultricies lacus fermentum, posuere arcu. Ut eget elit magna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse feugiat auctor finibus. Ut in euismod magna. Fusce eget dapibus arcu. Curabitur laoreet elit id lobortis tristique. Sed vel finibus turpis. Nulla sed lectus ante. Sed rutrum libero odio, non congue erat hendrerit non. Nunc in vulputate dolor, et dapibus neque. Sed accumsan sapien fermentum facilisis pharetra. Pellentesque fermentum, ligula faucibus suscipit elementum, erat ante ullamcorper tortor, id cursus mi eros ut lorem.
        Mauris condimentum leo vitae leo vehicula tincidunt. Quisque vehicula erat elit. Donec commodo bibendum ipsum vel commodo. Curabitur egestas massa sed purus dapibus commodo. Nam auctor tempus lacus, quis eleifend ipsum faucibus id. Nunc ullamcorper velit in lorem ultrices, eu auctor ante euismod. Donec in congue lacus. Quisque erat nibh, viverra sit amet ultrices eu, imperdiet ut lectus.
        Nam at justo enim. Nam dictum facilisis mattis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce eget blandit ex, nec elementum erat. Vivamus purus purus, bibendum quis hendrerit sed, vehicula vitae arcu. Nam enim ligula, rutrum vitae imperdiet vitae, tristique id urna. Aenean rutrum sed nunc vel ultricies. Suspendisse iaculis, dolor vel blandit blandit, lacus tellus sodales nulla, id aliquam est nisl eu ligula. Nulla fermentum neque quis metus tristique scelerisque. Nulla aliquam vel libero sit amet mollis. Nulla ut consequat nisl. Proin eu dignissim nisi.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu urna tempus, ultricies lacus fermentum, posuere arcu. Ut eget elit magna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse feugiat auctor finibus. Ut in euismod magna. Fusce eget dapibus arcu. Curabitur laoreet elit id lobortis tristique. Sed vel finibus turpis. Nulla sed lectus ante. Sed rutrum libero odio, non congue erat hendrerit non. Nunc in vulputate dolor, et dapibus neque. Sed accumsan sapien fermentum facilisis pharetra. Pellentesque fermentum, ligula faucibus suscipit elementum, erat ante ullamcorper tortor, id cursus mi eros ut lorem.
        Mauris condimentum leo vitae leo vehicula tincidunt. Quisque vehicula erat elit. Donec commodo bibendum ipsum vel commodo. Curabitur egestas massa sed purus dapibus commodo. Nam auctor tempus lacus, quis eleifend ipsum faucibus id. Nunc ullamcorper velit in lorem ultrices, eu auctor ante euismod. Donec in congue lacus. Quisque erat nibh, viverra sit amet ultrices eu, imperdiet ut lectus.
        Nam at justo enim. Nam dictum facilisis mattis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce eget blandit ex, nec elementum erat. Vivamus purus purus, bibendum quis hendrerit sed, vehicula vitae arcu. Nam enim ligula, rutrum vitae imperdiet vitae, tristique id urna. Aenean rutrum sed nunc vel ultricies. Suspendisse iaculis, dolor vel blandit blandit, lacus tellus sodales nulla, id aliquam est nisl eu ligula. Nulla fermentum neque quis metus tristique scelerisque. Nulla aliquam vel libero sit amet mollis. Nulla ut consequat nisl. Proin eu dignissim nisi.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu urna tempus, ultricies lacus fermentum, posuere arcu. Ut eget elit magna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse feugiat auctor finibus. Ut in euismod magna. Fusce eget dapibus arcu. Curabitur laoreet elit id lobortis tristique. Sed vel finibus turpis. Nulla sed lectus ante. Sed rutrum libero odio, non congue erat hendrerit non. Nunc in vulputate dolor, et dapibus neque. Sed accumsan sapien fermentum facilisis pharetra. Pellentesque fermentum, ligula faucibus suscipit elementum, erat ante ullamcorper tortor, id cursus mi eros ut lorem.
        Mauris condimentum leo vitae leo vehicula tincidunt. Quisque vehicula erat elit. Donec commodo bibendum ipsum vel commodo. Curabitur egestas massa sed purus dapibus commodo. Nam auctor tempus lacus, quis eleifend ipsum faucibus id. Nunc ullamcorper velit in lorem ultrices, eu auctor ante euismod. Donec in congue lacus. Quisque erat nibh, viverra sit amet ultrices eu, imperdiet ut lectus.
        Nam at justo enim. Nam dictum facilisis mattis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce eget blandit ex, nec elementum erat. Vivamus purus purus, bibendum quis hendrerit sed, vehicula vitae arcu. Nam enim ligula, rutrum vitae imperdiet vitae, tristique id urna. Aenean rutrum sed nunc vel ultricies. Suspendisse iaculis, dolor vel blandit blandit, lacus tellus sodales nulla, id aliquam est nisl eu ligula. Nulla fermentum neque quis metus tristique scelerisque. Nulla aliquam vel libero sit amet mollis. Nulla ut consequat nisl. Proin eu dignissim nisi.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu urna tempus, ultricies lacus fermentum, posuere arcu. Ut eget elit magna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse feugiat auctor finibus. Ut in euismod magna. Fusce eget dapibus arcu. Curabitur laoreet elit id lobortis tristique. Sed vel finibus turpis. Nulla sed lectus ante. Sed rutrum libero odio, non congue erat hendrerit non. Nunc in vulputate dolor, et dapibus neque. Sed accumsan sapien fermentum facilisis pharetra. Pellentesque fermentum, ligula faucibus suscipit elementum, erat ante ullamcorper tortor, id cursus mi eros ut lorem.
        Mauris condimentum leo vitae leo vehicula tincidunt. Quisque vehicula erat elit. Donec commodo bibendum ipsum vel commodo. Curabitur egestas massa sed purus dapibus commodo. Nam auctor tempus lacus, quis eleifend ipsum faucibus id. Nunc ullamcorper velit in lorem ultrices, eu auctor ante euismod. Donec in congue lacus. Quisque erat nibh, viverra sit amet ultrices eu, imperdiet ut lectus.
        Nam at justo enim. Nam dictum facilisis mattis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce eget blandit ex, nec elementum erat. Vivamus purus purus, bibendum quis hendrerit sed, vehicula vitae arcu. Nam enim ligula, rutrum vitae imperdiet vitae, tristique id urna. Aenean rutrum sed nunc vel ultricies. Suspendisse iaculis, dolor vel blandit blandit, lacus tellus sodales nulla, id aliquam est nisl eu ligula. Nulla fermentum neque quis metus tristique scelerisque. Nulla aliquam vel libero sit amet mollis. Nulla ut consequat nisl. Proin eu dignissim nisi.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu urna tempus, ultricies lacus fermentum, posuere arcu. Ut eget elit magna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse feugiat auctor finibus. Ut in euismod magna. Fusce eget dapibus arcu. Curabitur laoreet elit id lobortis tristique. Sed vel finibus turpis. Nulla sed lectus ante. Sed rutrum libero odio, non congue erat hendrerit non. Nunc in vulputate dolor, et dapibus neque. Sed accumsan sapien fermentum facilisis pharetra. Pellentesque fermentum, ligula faucibus suscipit elementum, erat ante ullamcorper tortor, id cursus mi eros ut lorem.
        Mauris condimentum leo vitae leo vehicula tincidunt. Quisque vehicula erat elit. Donec commodo bibendum ipsum vel commodo. Curabitur egestas massa sed purus dapibus commodo. Nam auctor tempus lacus, quis eleifend ipsum faucibus id. Nunc ullamcorper velit in lorem ultrices, eu auctor ante euismod. Donec in congue lacus. Quisque erat nibh, viverra sit amet ultrices eu, imperdiet ut lectus.
        Nam at justo enim. Nam dictum facilisis mattis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce eget blandit ex, nec elementum erat. Vivamus purus purus, bibendum quis hendrerit sed, vehicula vitae arcu. Nam enim ligula, rutrum vitae imperdiet vitae, tristique id urna. Aenean rutrum sed nunc vel ultricies. Suspendisse iaculis, dolor vel blandit blandit, lacus tellus sodales nulla, id aliquam est nisl eu ligula. Nulla fermentum neque quis metus tristique scelerisque. Nulla aliquam vel libero sit amet mollis. Nulla ut consequat nisl. Proin eu dignissim nisi.
    </component-slot>
</gameface-scrollable-container>
`;
