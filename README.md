# ember-octicons

> [!WARNING]
> **This addon is deprecated and no longer maintained.** Modern Ember apps can use [`@primer/octicons`](https://www.npmjs.com/package/@primer/octicons) directly, without an addon. See [Migrating](#migrating) below.

ember-octicons was a build-time shim for classic Ember CLI builds. It copied Octicon SVG files into your app's assets with `app.import` and added Octicons' CSS to `vendor.css`. Embroider and Vite let apps import package assets directly, so the addon no longer adds anything.

Apps that already use ember-octicons 4.0.0 will keep working, but the addon will not get further updates. Its original documentation is in the [v4.0.0 README](https://github.com/kpfefferle/ember-octicons/blob/v4.0.0/README.md).

## Migrating

Remove the addon and depend on `@primer/octicons` directly:

```sh
npm uninstall ember-octicons
npm install --save-dev @primer/octicons
```

Remove the `octicons` options from `ember-cli-build.js`, then follow the steps below for the features you used.

### CSS

The addon added Octicons' CSS to `vendor.css`. Import it from your app's entry point instead:

```js
// app/app.js
import "@primer/octicons/build/build.css";
```

This works in Vite apps and in classic apps that use ember-auto-import. In a classic build, you can also keep it in `vendor.css`:

```js
// ember-cli-build.js
app.import("node_modules/@primer/octicons/build/build.css");
```

If you imported `octicons.css` from your own stylesheet, import `@primer/octicons/build/build.css` there instead.

### Inline SVG

To render icons inline, use a small component built on the `toSVG()` function in `@primer/octicons`:

```gjs
// app/components/octicon.gjs
import { htmlSafe } from "@ember/template";
import octicons from "@primer/octicons";

function octicon(name, size, label) {
  const options = {};
  if (size) options.width = size;
  if (label) options["aria-label"] = label;
  return htmlSafe(octicons[name].toSVG(options));
}

<template>{{octicon @name @size @label}}</template>
```

```gjs
<Octicon @name="alert" />
<Octicon @name="mark-github" @size="24" @label="GitHub" />
```

Icons render with the `octicon` class. Pass `@size="24"` to use the 24px version of an icon. If you don't pass `@label`, the icon gets `aria-hidden="true"`; if you do, it gets `role="img"`.

`@primer/octicons` contains every icon (about 1 MB of icon data before compression), and all of it goes into your bundle. If you only use a few icons, use one of the methods below instead.

### SVG files (`<img>` tags)

Replaces the addon's `octicons.icons` option.

In a Vite or Embroider app, import an icon file to get its URL. Only the icons you import are added to the build:

```gjs
import githubIcon from "@primer/octicons/build/svg/mark-github-16.svg";

<template><img src={{githubIcon}} class="octicon" alt="GitHub" /></template>
```

Classic builds can't import SVG files from JavaScript without extra webpack configuration. Use the component above or ember-svg-jar instead.

### ember-svg-jar

If you used ember-octicons with [ember-svg-jar](https://github.com/ivanvotti/ember-svg-jar), you only need to remove `ember-octicons`. Keep the ember-svg-jar `sourceDirs` setting that points at `node_modules/@primer/octicons/build/svg`, and keep calling `{{svg-jar "mark-github-16" class="octicon"}}`.

## License

This project is licensed under the [MIT License](LICENSE.md).
