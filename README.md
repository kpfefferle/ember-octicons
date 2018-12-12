# ember-octicons [![CircleCI](https://circleci.com/gh/kpfefferle/ember-octicons.svg?style=svg)](https://circleci.com/gh/kpfefferle/ember-octicons)

[![Ember Observer Score](https://emberobserver.com/badges/ember-octicons.svg)](https://emberobserver.com/addons/ember-octicons)

Easily import [GitHub Octicons](https://octicons.github.com/) into an Ember application's build.

## Usage

In your ember-cli project, run:

```sh
ember install ember-octicons
```

When the addon is installed, it will add the `octicons` NPM dependency to your project.

### Importing SVG Icons

To import Octicon SVGs as build time assets, add an `octicons` configuration object to the options set in `ember-cli-build.js`. Within the `octicons` object, define an `icons` property containing an array of Octicon names. If no icons are specified, then all Octicon SVGs will be imported into your project.

```js
// ember-cli-build.js
  let app = new EmberAddon(defaults, {
    octicons: {
      icons: ['alert', 'bell', 'j', /* etc... */]
    }
  });
```

Now the SVG file can be used like any other asset:

```hbs
<img src="images/svg/octicons/mark-github.svg">
```

By default, SVG files will be imported into the `images/svg/octicons` directory. To customize the import destination, set a `destDir` in the `octicons` config:

```js
// ember-cli-build.js
  let app = new EmberAddon(defaults, {
    octicons: {
      destDir: 'some/other/folder',
      icons: ['alert', 'bell', 'mark-github', /* etc... */]
    }
  });
```

### Using Octicons with Ember SVGJar

If you would rather use [ember-svg-jar](https://github.com/ivanvotti/ember-svg-jar) to embed your SVG icons, install ember-svg-jar and add the following configuration to your `ember-cli-build.js`:

```js
// ember-cli-build.js
  let app = new EmberAddon(defaults, {
    octicons: {
      icons: null // don't import any SVG files at build time
    },
    svgJar: {
      sourceDirs: [
        'public', // default SVGJar lookup directory
        'node_modules/octicons/build/svg'
      ]
    }
  });
```

And then use Ember SVGJar's `{{svg-jar}}` helper:

```hbs
{{svg-jar "mark-github" class="octicon"}}
```

### CSS

By default, the addon will add Octicons' normalizing CSS to your project's `vendor.css`. If you are not linking to `vendor.css` in your project's `index.html`, you can manually import the normalizing CSS into your application CSS instead:

```scss
// app/styles/app.scss
@import "octicons";
```

```css
/* app/styles/app.css */
@import "octicons.css";
```
