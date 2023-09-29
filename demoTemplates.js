const homeTemplate = `
<p>This is the demo page of the components.
The navigation is achieved using the router component.
To see all other components navigate to the respective page.</p>
`;

const checkBoxTemplate = `<gameface-checkbox class="checkbox-component"></gameface-checkbox>`;

const dropDownTemplate = `
<gameface-dropdown class="gameface-dropdown-component">
<dropdown-option slot="option">Cat1</dropdown-option>
<dropdown-option slot="option" disabled>Cat1</dropdown-option>
<dropdown-option slot="option" disabled>Cat1</dropdown-option>
<dropdown-option slot="option">Cat3</dropdown-option>
<dropdown-option slot="option">Cat4</dropdown-option>
<dropdown-option slot="option">Dog</dropdown-option>
<dropdown-option slot="option">Giraffe</dropdown-option>
<dropdown-option slot="option">Lion</dropdown-option>
<dropdown-option slot="option" disabled>Pig</dropdown-option>
<dropdown-option slot="option">Eagle</dropdown-option>
<dropdown-option slot="option">Parrot</dropdown-option>
<dropdown-option slot="option" disabled>Last Parrot</dropdown-option>
<dropdown-option slot="option" disabled>Last Parrota</dropdown-option>
<dropdown-option slot="option">Last Parrot</dropdown-option>
</gameface-dropdown>`;

const responsiveGridTemplate = `
<div>
<h2>Fluid</h2>
<div class="guic-row">
    <div class="guic-col-12">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-2">
        <div class="box"></div>
    </div>
    <div class="guic-col-10">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-1">
        <div class="box"></div>
    </div>
    <div class="guic-col-11">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-3">
        <div class="box"></div>
    </div>
    <div class="guic-col-9">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-4">
        <div class="box"></div>
    </div>
    <div class="guic-col-8">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-5">
        <div class="box"></div>
    </div>
    <div class="guic-col-7">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-6">
        <div class="box"></div>
    </div>
    <div class="guic-col-6">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-3">
        <div class="box"></div>
    </div>
    <div class="guic-col-3">
        <div class="box"></div>
    </div>
    <div class="guic-col-3">
        <div class="box"></div>
    </div>
    <div class="guic-col-3">
        <div class="box"></div>
    </div>
</div>

<h2>Offsets</h2>
<div class="guic-row">
    <div class="guic-col-offset-11 guic-col-1">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-offset-10 guic-col-2">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-offset-9 guic-col-3">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-offset-8 guic-col-4">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-offset-7 guic-col-5">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-offset-6 guic-col-6">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-offset-5 guic-col-7">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-offset-4 guic-col-8">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-offset-3 guic-col-9">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-offset-2 guic-col-10">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-offset-1 guic-col-11">
        <div class="box"></div>
    </div>
</div>

<h2>Auto Width</h2>
<div class="guic-row">
    <div class="guic-col">
        <div class="box"></div>
    </div>
    <div class="guic-col">
        <div class="box"></div>
    </div>
    <div class="guic-col">
        <div class="box"></div>
    </div>
    <div class="guic-col">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col">
        <div class="box"></div>
    </div>
    <div class="guic-col">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col">
        <div class="box"></div>
    </div>
    <div class="guic-col">
        <div class="box"></div>
    </div>
    <div class="guic-col">
        <div class="box"></div>
    </div>
</div>

<h2>Set and Auto Width</h2>
<div class="guic-row">
    <div class="guic-col-4">
        <div class="box"></div>
    </div>
    <div class="guic-col">
        <div class="box"></div>
    </div>
    <div class="guic-col-2">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col-3">
        <div class="box"></div>
    </div>
    <div class="guic-col">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col">
        <div class="box"></div>
    </div>
    <div class="guic-col-3">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col">
        <div class="box"></div>
    </div>
    <div class="guic-col-5">
        <div class="box"></div>
    </div>
    <div class="guic-col">
        <div class="box"></div>
    </div>
</div>
<h2>Static Size and Auto Width</h2>
<div class="guic-row">
    <div class="guic-col custom-static-col-300px">
        <div class="box"></div>
    </div>
    <div class="guic-col">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col">
        <div class="box"></div>
    </div>
    <div class="guic-col custom-static-col-300px">
        <div class="box"></div>
    </div>
</div>
<div class="guic-row">
    <div class="guic-col custom-static-col-300px">
        <div class="box"></div>
    </div>
    <div class="guic-col">
        <div class="box"></div>
    </div>
    <div class="guic-col custom-static-col-300px">
        <div class="box"></div>
    </div>
</div>
<div>`;

const menuTemplate = `
<gameface-menu orientation="horizontal" class="menu-component">
<menu-item slot="menu-item">Start Game</menu-item>
<menu-item slot="menu-item">
    Settings
    <gameface-left-menu>
        <menu-item slot="menu-item">Graphics</menu-item>
        <menu-item slot="menu-item">
            Keyboard
            <gameface-left-menu>
                <menu-item slot="menu-item">Graphics</menu-item>
                <menu-item slot="menu-item">Keyboard</menu-item>
                <menu-item slot="menu-item">
                    Mouse
                    <gameface-left-menu>
                        <menu-item slot="menu-item">Graphics</menu-item>
                        <menu-item slot="menu-item">Keyboard</menu-item>
                        <menu-item slot="menu-item">Mouse</menu-item>
                    </gameface-left-menu>
                </menu-item>
            </gameface-left-menu>
        </menu-item>
        <menu-item slot="menu-item">
            Mouse
        </menu-item>
    </gameface-left-menu>
</menu-item>
<menu-item slot="menu-item" disabled>Hero Gallery</menu-item>
<menu-item slot="menu-item">Credits</menu-item>
</gameface-menu>
`;

const scrollableContainerTemplate = `
<gameface-scrollable-container class="scrollbar-component">
<component-slot data-name="scrollable-content">
    <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu urna tempus, ultricies lacus
        fermentum, posuere arcu. Ut eget elit magna. Interdum et malesuada fames ac ante ipsum
        primis in faucibus. Suspendisse feugiat auctor finibus. Ut in euismod magna. Fusce eget
        dapibus arcu. Curabitur laoreet elit id lobortis tristique. Sed vel finibus turpis. Nulla
        sed lectus ante. Sed rutrum libero odio, non congue erat hendrerit non. Nunc in vulputate
        dolor, et dapibus neque. Sed accumsan sapien fermentum facilisis pharetra. Pellentesque
        fermentum, ligula faucibus suscipit elementum, erat ante ullamcorper tortor, id cursus mi
        eros ut lorem.

        Mauris condimentum leo vitae leo vehicula tincidunt. Quisque vehicula erat elit. Donec
        commodo bibendum ipsum vel commodo. Curabitur egestas massa sed purus dapibus commodo. Nam
        auctor tempus lacus, quis eleifend ipsum faucibus id. Nunc ullamcorper velit in lorem
        ultrices, eu auctor ante euismod. Donec in congue lacus. Quisque erat nibh, viverra sit amet
        ultrices eu, imperdiet ut lectus.

        Integer pellentesque convallis nibh id viverra. Nam consequat rhoncus placerat. Donec velit
        tortor, malesuada et scelerisque ut, commodo sit amet purus. Proin nec enim ultricies mi
        vulputate dignissim. Integer varius augue vel tortor semper, non tempor lectus tempor.
        Aenean ac iaculis lacus, vel placerat nunc. Praesent rhoncus nisi vel tortor sollicitudin,
        ut sollicitudin nunc cursus. Suspendisse fringilla magna non sapien commodo, et vulputate
        erat volutpat. Aenean suscipit pulvinar faucibus. Nullam semper porta purus vitae efficitur.
        Sed id pharetra ligula, eget aliquet libero. Duis eleifend blandit lorem sed hendrerit.
        Nulla volutpat dapibus aliquam. Vestibulum vehicula elementum dui id maximus.

        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
        Proin aliquam pretium cursus. Vivamus in gravida odio, eu pulvinar quam. Sed sit amet
        elementum neque. Fusce dui dolor, laoreet a eros a, hendrerit ultricies nibh. Suspendisse
        aliquam magna diam, quis porttitor diam dictum viverra. Sed in lacus tincidunt, sodales quam
        non, dapibus lacus. Phasellus scelerisque velit elit, eget hendrerit ipsum lacinia eu.
        Aliquam vitae sem et mauris molestie porttitor. Vestibulum in convallis lectus. Nam at
        turpis eget mauris gravida ullamcorper. Sed metus ex, semper eget quam vitae, pellentesque
        gravida lectus. Etiam condimentum sit amet felis ac tempor. Duis finibus accumsan justo, id
        dictum purus ornare at.

        Mauris congue elementum pellentesque. Quisque vel tempor ipsum. Mauris dignissim suscipit ex
        vel posuere. Fusce mattis tortor in cursus feugiat. Duis consequat sem non tempor fringilla.
        Duis ac orci velit. Curabitur et sem elit. Nam enim nisl, pellentesque in rutrum a,
        tincidunt vitae augue. Orci varius natoque penatibus et magnis dis parturient montes,
        nascetur ridiculus mus.

        Aliquam nunc tellus, ultricies vel vehicula ac, ultrices nec ipsum. Integer luctus vitae
        nunc quis sollicitudin. Proin id ipsum dapibus urna aliquet vulputate. Curabitur consequat
        tincidunt massa non condimentum. Sed at lobortis metus. Donec sed elit sit amet orci lacinia
        sagittis nec ac sapien. Etiam convallis nibh nec tellus mattis, in sagittis enim posuere.
        Pellentesque et pharetra diam. Integer lacinia dapibus felis, id ornare tellus pellentesque
        a. Quisque venenatis ligula sed nisl faucibus, non ornare quam porta. Nullam vitae luctus
        nibh. Duis quis consectetur urna. Vivamus elementum id nulla eu viverra.

        In maximus, libero ac placerat blandit, metus risus pretium augue, sed porta nunc risus ac
        justo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus
        mus. Maecenas interdum eleifend convallis. Aliquam erat volutpat. Aliquam ac efficitur odio.
        Sed sit amet ex eget nibh volutpat maximus vitae facilisis dui. Cras vitae egestas nisi. In
        hac habitasse platea dictumst. Integer eget leo in enim gravida rhoncus vitae ut sapien.
        Donec eget sapien est. Sed sapien lacus, feugiat sed nibh at, luctus tempus velit. Nulla vel
        imperdiet nibh, at sodales lacus. Proin in consequat lacus. Suspendisse eu ullamcorper nisl.

        Donec arcu enim, fermentum vitae elementum vel, cursus tincidunt metus. Nulla aliquam enim
        quis sagittis dictum. Praesent venenatis sed elit non lobortis. Mauris sodales rutrum
        volutpat. Suspendisse eget sem et enim varius cursus quis in lectus. Fusce libero sapien,
        tincidunt sit amet pellentesque nec, consequat vel dolor. Quisque sit amet nibh suscipit
        justo scelerisque vehicula at in augue. Ut tincidunt blandit erat sed tincidunt. Maecenas
        imperdiet eleifend vulputate. Vivamus sit amet est suscipit, ornare tortor a, sagittis nibh.

        Quisque pretium vulputate bibendum. Proin interdum tortor vitae urna facilisis feugiat. In
        tincidunt enim massa, sit amet laoreet nisl aliquet et. Suspendisse quam turpis, egestas
        vitae efficitur et, hendrerit nec sem. Nullam commodo neque ipsum, vel iaculis mauris
        facilisis vel. Suspendisse at magna ut libero ornare tempor in non ex. Aenean maximus dictum
        turpis, et rutrum sapien elementum a. Nulla convallis ipsum ut efficitur convallis.
        Suspendisse suscipit iaculis scelerisque. Nunc eu dui augue. Duis nec pellentesque odio, a
        iaculis lacus. Morbi venenatis nibh lacus, quis molestie ante finibus in. Etiam scelerisque
        magna quis feugiat ultricies.

        Cras euismod massa sed risus aliquam eleifend. Phasellus finibus augue ac rhoncus mattis.
        Sed commodo erat quis urna faucibus facilisis. Cras sit amet risus nec nunc dignissim
        porttitor nec sit amet ligula. Mauris tincidunt cursus eros, in convallis magna ultricies
        eu. Donec ut faucibus ligula. In vitae dui dolor. Suspendisse varius non nisi id auctor.
        Suspendisse et ligula at elit vulputate commodo. Fusce aliquam sagittis orci, quis porta
        tellus. Donec nunc leo, viverra facilisis ante quis, tincidunt sagittis orci. Aliquam
        feugiat tincidunt posuere. Morbi nibh neque, lacinia ut semper id, efficitur quis mauris.
        Aliquam accumsan elit nec leo elementum, volutpat consectetur orci tempus. Pellentesque
        consectetur dapibus ante quis condimentum. Vestibulum tellus ex, pretium quis auctor id,
        fermentum a nisl.

        Suspendisse potenti. Mauris tristique, felis eget tempus maximus, eros lorem vestibulum
        risus, ac viverra enim est nec tortor. Aenean velit urna, molestie scelerisque neque eget,
        viverra facilisis enim. Etiam cursus venenatis velit, eleifend ultrices felis molestie eget.
        Etiam congue vehicula dui, molestie sagittis massa cursus sed. Nunc congue accumsan est at
        suscipit. Sed ut congue massa. Nulla non dui quis velit interdum pharetra. Proin posuere
        bibendum nibh non tincidunt. Phasellus id lectus lacus. In hac habitasse platea dictumst.
        Etiam placerat consequat scelerisque. Praesent vitae risus at felis laoreet congue. Donec
        rhoncus lacus eget dignissim convallis. Duis nisl neque, ultricies euismod nisl et, sagittis
        congue urna.

        Fusce rhoncus elit sit amet tellus convallis tempus. Etiam malesuada varius ex, sit amet
        feugiat sapien rutrum quis. Mauris at turpis cursus, vestibulum sem nec, consectetur libero.
        Morbi rutrum varius elementum. Proin scelerisque purus in libero laoreet, nec interdum
        sapien condimentum. Aliquam imperdiet ligula nec leo elementum pharetra. Quisque ac libero
        id nisi lobortis efficitur.

        Aliquam erat volutpat. Donec consectetur suscipit arcu sit amet posuere. Orci varius natoque
        penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque pulvinar
        sollicitudin odio a semper. Sed consectetur dui vel nisl egestas, et aliquam est iaculis.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget sodales lorem.
        Phasellus at pharetra ex, nec euismod massa.

        Cras sollicitudin interdum dignissim. Aliquam commodo efficitur posuere. Quisque et dolor in
        quam vulputate semper. Suspendisse euismod fermentum dictum. Sed pretium diam lacus. Sed sed
        erat tempor, gravida sem id, facilisis nibh. Aenean scelerisque urna non fermentum laoreet.
        Quisque faucibus lacinia sapien elementum faucibus. Duis id lorem a magna mollis efficitur.
        Integer venenatis eget leo nec viverra. Etiam ac felis sollicitudin, venenatis erat
        molestie, blandit ante. Aenean volutpat arcu enim, in ultrices arcu suscipit ac. Curabitur
        porta venenatis maximus. Vivamus sed viverra ipsum, nec posuere elit. Morbi placerat egestas
        massa, non convallis sem dignissim sit amet. Quisque arcu ex, auctor at elit non, dignissim
        vulputate lorem.

        Mauris pulvinar in est vitae consequat. Mauris volutpat justo non ligula malesuada, et
        porttitor dui auctor. Cras sit amet ex volutpat, aliquam mauris quis, aliquam justo.
        Praesent non orci nec dui bibendum faucibus porttitor sed elit. Praesent lobortis lacus nec
        erat commodo, ut lobortis dolor lobortis. Mauris rhoncus arcu vel nisl fringilla
        pellentesque. Pellentesque sit amet nunc convallis, tincidunt neque vel, elementum dolor.
        Quisque sit amet imperdiet quam. Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Morbi ultricies tellus dolor, ac rhoncus nulla posuere
        ac.

        Sed rutrum consequat condimentum. In at lacus est. Ut varius mi nunc. Proin aliquet justo
        lacus. Etiam ut mauris lacinia, placerat purus eget, elementum felis. Aliquam commodo ac
        tortor nec elementum. Nulla imperdiet erat nec justo tristique laoreet. Vivamus quis eros
        gravida, dignissim ante in, scelerisque tellus. Aenean euismod hendrerit ex vel porta. Nunc
        ac nisl eros. Morbi efficitur lorem lectus, in rhoncus purus tempor vel. Phasellus id mi
        placerat, venenatis dui eu, sagittis risus.

        Ut ac ornare leo. Duis condimentum lorem ut est scelerisque malesuada. Etiam varius ornare
        libero, nec consequat magna tristique porttitor. Cras dapibus, augue vel hendrerit
        fermentum, nibh lectus venenatis dui, quis porta odio lorem dignissim lacus. Aliquam tempor
        eros et volutpat tincidunt. Vestibulum vel sagittis libero, pretium iaculis enim. Etiam
        libero nulla, consequat quis nunc id, viverra condimentum turpis. Nulla facilisi. Mauris sit
        amet auctor justo. Ut faucibus erat a ornare malesuada. Duis a justo pharetra, ullamcorper
        lacus quis, iaculis lectus. Morbi dapibus nisl mauris, ac tincidunt est vehicula eu.
        Suspendisse purus risus, efficitur ac rhoncus eu, congue vel ipsum. Ut pharetra tristique
        feugiat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac
        turpis egestas.

        Nam ut rutrum massa. Suspendisse tincidunt tempor mauris, vitae auctor nisl viverra quis.
        Quisque vitae bibendum turpis. Morbi ut lectus eros. Aliquam sed quam vitae risus semper
        bibendum vitae pretium augue. Integer rhoncus consectetur orci eget mollis. Vestibulum
        cursus ut leo vitae sagittis. Integer pretium eu lorem vel elementum. Nunc vehicula sit amet
        augue ultrices commodo. Cras in ornare est. Cras tristique luctus nibh, non lacinia orci
        pretium nec. Integer a ligula non velit dignissim facilisis nec ut lectus. Maecenas eget
        lobortis lectus.

        Ut pretium mi in purus interdum, ut mattis tortor vulputate. Nunc eu blandit magna, nec
        efficitur augue. Etiam ac hendrerit sapien. Vestibulum ante ipsum primis in faucibus orci
        luctus et ultrices posuere cubilia curae; Etiam eu gravida lorem. Phasellus accumsan porta
        lacinia. Nam eu augue non dolor consectetur hendrerit vitae non massa. Etiam commodo vel
        dolor eu vestibulum. Ut euismod tempus urna, et commodo nibh varius sit amet. Nam posuere
        ornare faucibus. In hac habitasse platea dictumst. Integer elit tellus, vehicula nec odio
        ac, efficitur ultricies nunc. Sed laoreet volutpat facilisis. Integer orci massa, posuere
        sed enim ut, vulputate viverra ex. Mauris consectetur turpis ac porta interdum. Nam eu porta
        leo.

        Nam at justo enim. Nam dictum facilisis mattis. Orci varius natoque penatibus et magnis dis
        parturient montes, nascetur ridiculus mus. Fusce eget blandit ex, nec elementum erat.
        Vivamus purus purus, bibendum quis hendrerit sed, vehicula vitae arcu. Nam enim ligula,
        rutrum vitae imperdiet vitae, tristique id urna. Aenean rutrum sed nunc vel ultricies.
        Suspendisse iaculis, dolor vel blandit blandit, lacus tellus sodales nulla, id aliquam est
        nisl eu ligula. Nulla fermentum neque quis metus tristique scelerisque. Nulla aliquam vel
        libero sit amet mollis. Nulla ut consequat nisl. Proin eu dignissim nisi.
    </div>
</component-slot>
</gameface-scrollable-container>
`;

const sliderTemplate = `<gameface-slider class="horizontal-slider-component" orientation="horizontal"></gameface-slider>`;
const rangeSliderTemplate = `<gameface-rangeslider orientation="horizontal" min="56" max="255" grid thumb></gameface-rangeslider>`;
const modalTemplate = `<gameface-modal class="modal-component"></gameface-modal>`;
const tabsTemplate = `<gameface-tabs>
<tab-heading slot="tab">Chapter One</tab-heading>
<tab-panel slot="panel">Chapter One Content</tab-panel>
<tab-heading slot="tab">Chapter Two</tab-heading>
<tab-panel slot="panel">Chapter Two Content</tab-panel>
<tab-heading slot="tab">Chapter Three</tab-heading>
<tab-panel slot="panel">Chapter Three Content</tab-panel>
<tab-heading slot="tab">Chapter Four</tab-heading>
<tab-panel slot="panel">Chapter Four Content</tab-panel>
</gameface-tabs>`;

const radialMenuTemplate = `
<div>
<p>Press the Left Shift key to open the menu.</p>
<!-- Shift key to open. -->
<gameface-radial-menu id="radial-menu-one" data-name="Radial Menu" data-change-event-name="radOneItemChanged"
    data-select-event-name="radOneItemSelected" data-open-key-code="shift"
    class="radial-menu-component"></gameface-radial-menu>
</div>
<div>
`;

const automaticGridTemplate = `
<gameface-automatic-grid class="automatic-grid-component" columns="7" rows="5" draggable>
    <component-slot data-name="item" col="3" row="2" class="box">1</component-slot>
    <component-slot data-name="item" col="3" row="2" class="box">2</component-slot>
    <component-slot data-name="item" col="8" row="8" class="box">3</component-slot>
    <component-slot data-name="item" class="box">4</component-slot>
    <component-slot data-name="item" class="box">5</component-slot>
    <component-slot data-name="item" class="box">6</component-slot>
</gameface-automatic-grid>
`;

const progressBarTemplate = `
<div class="progress-bar-wrapper">
<gameface-progress-bar id="progress-bar" data-animation-duration="500"></gameface-progress-bar>
</div>
`;

const switchTemplate = `
<div class="switch-components-wrapper">
    <gameface-switch>
        <component-slot data-name="switch-unchecked">Off</component-slot>
        <component-slot data-name="switch-checked">On</component-slot>
    </gameface-switch>
    <gameface-switch type="inset" checked>
        <component-slot data-name="switch-unchecked">Off</component-slot>
        <component-slot data-name="switch-checked">On</component-slot>
    </gameface-switch>
    <gameface-switch type="text-inside">
        <component-slot data-name="switch-unchecked">Off</component-slot>
        <component-slot data-name="switch-checked">On</component-slot>
    </gameface-switch>
    <gameface-switch disabled checked>
        <component-slot data-name="switch-unchecked">Off</component-slot>
        <component-slot data-name="switch-checked">On</component-slot>
    </gameface-switch>
    <gameface-switch type="inset" disabled>
        <component-slot data-name="switch-unchecked">Off</component-slot>
        <component-slot data-name="switch-checked">On</component-slot>
    </gameface-switch>
    <gameface-switch type="text-inside" disabled checked>
        <component-slot data-name="switch-unchecked">Off</component-slot>
        <component-slot data-name="switch-checked">On</component-slot>
    </gameface-switch>
</div>
`;

const textFieldsTemplate = `
<div class="text-fields-container">
    <div class="text-field-case">
        <h2>Text</h2>
        <gameface-text-field type="text"></gameface-text-field>

        <gameface-text-field id="test1" type="text" label="Text:"></gameface-text-field>

        <gameface-text-field type="text" value="default value" label="Text:"></gameface-text-field>

        <gameface-text-field type="text" disabled value="(disabled) default value" label="Text:">
        </gameface-text-field>

        <gameface-text-field type="text" readonly value="(read only) default value" label="Text:">
        </gameface-text-field>

        <gameface-text-field type="text"
            placeholder="Type some very very long text here to test overflow and placeholder" label="Text:">
        </gameface-text-field>

        <gameface-text-field disabled type="text" placeholder="This input is disabled" label="Text:">
        </gameface-text-field>

        <gameface-text-field readonly type="text" placeholder="This input is read only" label="Text:">
        </gameface-text-field>

        <gameface-text-field disabled type="text" value="I am disabled but I have a value"
            placeholder="This input is disabled" label="Text:">
        </gameface-text-field>

        <gameface-text-field type="text" value="The value should be visible instead the placeholder"
            placeholder="Type some very very long text here to test overflow and placeholder" label="Text:">
        </gameface-text-field>

        <gameface-text-field type="text" minlength="3" maxlength="15" value="min-max-test" label="Text:">
        </gameface-text-field>

        <gameface-text-field class="custom-input-styles" type="text" label="Text:"></gameface-text-field>
    </div>
    <div class="text-field-case">
        <h2>Password</h2>

        <gameface-text-field type="password"></gameface-text-field>

        <gameface-text-field type="password" label="Password:"></gameface-text-field>

        <gameface-text-field type="password" value="default value" label="Password:"></gameface-text-field>

        <gameface-text-field type="password" disabled value="(disabled) default value" label="Password:">
        </gameface-text-field>

        <gameface-text-field type="password" readonly value="(read only) default value" label="Password:">
        </gameface-text-field>

        <gameface-text-field type="password"
            placeholder="Type some very very long text here to test overflow and placeholder" label="Password:">
        </gameface-text-field>

        <gameface-text-field disabled type="password" placeholder="This input is disabled" label="Password:">
        </gameface-text-field>

        <gameface-text-field readonly type="password" placeholder="This input is read only" label="Password:">
        </gameface-text-field>

        <gameface-text-field disabled type="password" value="I am disabled but I have a value"
            placeholder="This input is disabled" label="Password:">
        </gameface-text-field>

        <gameface-text-field type="password" value="The value should be visible instead the placeholder"
            placeholder="Type some very very long text here to test overflow and placeholder" label="Password:">
        </gameface-text-field>

        <gameface-text-field type="password" minlength="3" maxlength="15" value="min-max-test" label="Password:">
        </gameface-text-field>

        <gameface-text-field class="custom-input-styles" type="password" label="Password:"></gameface-text-field>
    </div>
    <div class="text-field-case">
        <h2>Search</h2>

        <gameface-text-field type="search"></gameface-text-field>

        <gameface-text-field type="search" label="Search:"></gameface-text-field>

        <gameface-text-field type="search" value="default value" label="Search:"></gameface-text-field>

        <gameface-text-field type="search" disabled value="(disabled) default value" label="Search:">
        </gameface-text-field>

        <gameface-text-field type="search" readonly value="(read only) default value" label="Search:">
        </gameface-text-field>

        <gameface-text-field type="search"
            placeholder="Type some very very long text here to test overflow and placeholder" label="Search:">
        </gameface-text-field>

        <gameface-text-field disabled type="search" placeholder="This input is disabled" label="Search:">
        </gameface-text-field>

        <gameface-text-field readonly type="search" placeholder="This input is read only" label="Search:">
        </gameface-text-field>

        <gameface-text-field disabled type="search" value="I am disabled but I have a value"
            placeholder="This input is disabled" label="Search:">
        </gameface-text-field>

        <gameface-text-field type="search" value="The value should be visible instead the placeholder"
            placeholder="Type some very very long text here to test overflow and placeholder" label="Search:">
        </gameface-text-field>

        <gameface-text-field type="search" minlength="3" maxlength="15" value="min-max-test" label="Search:">
        </gameface-text-field>

        <gameface-text-field type="search" control-disabled value="control is disabled" label="Search:">
        </gameface-text-field>

        <gameface-text-field class="custom-input-styles" type="search" label="Search:"></gameface-text-field>
    </div>
    <div class="text-field-case">
        <h2>Number</h2>

        <gameface-text-field type="number"></gameface-text-field>

        <gameface-text-field type="number" label="Number:"></gameface-text-field>

        <gameface-text-field type="number" value="7" label="Number:"></gameface-text-field>

        <gameface-text-field type="number" value="wrong default value" label="Number:"></gameface-text-field>

        <gameface-text-field type="number" disabled value="7" label="Number:"></gameface-text-field>

        <gameface-text-field type="number" readonly value="7" label="Number:"></gameface-text-field>

        <gameface-text-field type="number"
            placeholder="Type some very very long number here to test overflow and placeholder" label="Number:">
        </gameface-text-field>

        <gameface-text-field disabled type="number" placeholder="This input is disabled" label="Number:">
        </gameface-text-field>

        <gameface-text-field readonly type="number" placeholder="This input is read only" label="Number:">
        </gameface-text-field>

        <gameface-text-field disabled type="number" value="7" placeholder="This input is disabled" label="Number:">
        </gameface-text-field>

        <gameface-text-field type="number" value="7"
            placeholder="Type some very very long text here to test overflow and placeholder" label="Number:">
        </gameface-text-field>

        <gameface-text-field type="number" min="3" max="15" value="4" label="Number:">
        </gameface-text-field>

        <gameface-text-field type="number" min="3" max="15" value="4.5" step="0.5" label="Number:">
        </gameface-text-field>

        <gameface-text-field type="number" min="3" max="15" value="0" label="Number:">
        </gameface-text-field>

        <gameface-text-field type="number" min="3" max="15" value="20" label="Number:">
        </gameface-text-field>

        <gameface-text-field type="number" control-disabled label="Number:">
        </gameface-text-field>

        <gameface-text-field class="custom-input-styles" type="number" label="Number:"></gameface-text-field>
    </div>
</div>
`;

export {
    homeTemplate,
    checkBoxTemplate,
    dropDownTemplate,
    responsiveGridTemplate,
    menuTemplate,
    scrollableContainerTemplate,
    sliderTemplate,
    rangeSliderTemplate,
    modalTemplate,
    tabsTemplate,
    radialMenuTemplate,
    automaticGridTemplate,
    progressBarTemplate,
    switchTemplate,
    textFieldsTemplate,
};
