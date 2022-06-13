---
date: 2022-3-25
title: Installation
draft: false
weight: 1
---

The coherent-gameface-interaction-manager is distributed as both ESM and UMD bundles.

## Using NPM

To install it you can run
```
npm install coherent-gameface-interaction-manager
```

and then do
```
import * as interactionManager from 'coherent-gameface-interaction-manager';
```

or you can also link it in your HTML directly

```
<script src="node_modules/coherent-gameface-interaction-manager/dist/interaction-manager.min.js"></script>
```

## Using a CDN
You can either download the coherent-gameface-interaction-manager from [UNPKG](https://unpkg.com/coherent-gameface-interaction-manager/dist/interaction-manager.min.js) or [jsDelivr](https://cdn.jsdelivr.net/npm/coherent-gameface-interaction-manager/dist/interaction-manager.min.js)

and then include it to your HTML
```
<script src="interaction-manager.min.js"></script>
```

or you can include it directly as a CDN link
```
<script src="https://unpkg.com/coherent-gameface-interaction-manager/dist/interaction-manager.min.js"></script>
```

{{< alert icon="❗" text="If you plan on using the coherent-gameface-interaction-manager as a CDN link inside your project you need to make sure it will run with internet connection." />}}