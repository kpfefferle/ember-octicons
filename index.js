'use strict';

const Funnel = require('broccoli-funnel');
const fs = require('fs');
const glob = require('glob');
const validatePeerDependencies = require('validate-peer-dependencies');

const octiconsDir = 'node_modules/@primer/octicons';

module.exports = {
  name: require('./package').name,

  init() {
    this._super.init.apply(this, arguments);

    validatePeerDependencies(__dirname, {
      resolvePeerDependenciesFrom: this.parent.root,
    });
  },

  included(app) {
    this._super.included(app);

    let octiconsConfig = this.buildConfig();

    // Import SVG icons
    if (octiconsConfig.icons !== null) {
      let destDir = octiconsConfig.destDir || 'images/svg/octicons';
      octiconsConfig.icons.forEach((icon) => {
        let baseFile = `${octiconsDir}/build/svg/${icon}`;
        let notFound = true;
        if (fs.existsSync(`${baseFile}.svg`)) {
          app.import(`${baseFile}.svg`, {
            destDir,
          });
          notFound = false;
        }
        if (fs.existsSync(`${baseFile}-16.svg`)) {
          app.import(`${baseFile}-16.svg`, {
            destDir,
          });
          notFound = false;
        }
        if (fs.existsSync(`${baseFile}-24.svg`)) {
          app.import(`${baseFile}-24.svg`, {
            destDir,
          });
          notFound = false;
        }
        if (notFound) {
          this.writeWarning(`Unknown icon: '${icon}' will not be imported`);
        }
      });
    }

    // Import CSS into Vendor bundle
    app.import(`${octiconsDir}/build/build.css`);
  },

  treeForStyles() {
    // Make CSS available for custom import into application bundle
    return new Funnel(octiconsDir, {
      srcDir: 'build',
      destDir: '/app/styles',
      include: ['build.css'],
      getDestinationPath(relativePath) {
        if (relativePath === 'build.css') {
          return 'octicons.css';
        }
        return relativePath;
      },
    });
  },

  buildConfig() {
    let config = (this.app && this.app.options) || {};
    let octiconsConfig = Object.assign(
      {
        destDir: null,
        icons: [],
      },
      config['octicons'],
    );

    if (octiconsConfig.icons !== null && octiconsConfig.icons.length === 0) {
      this.writeWarning(
        'No octicons were specified in ember-cli-build; defaulting to all icons',
      );

      glob
        .sync(`${octiconsDir}/build/svg/*.svg`)
        .map((i) => i.split('/').pop())
        .map((i) => i.replace(/\.svg$/i, ''))
        .reduce((a, v) => {
          a.icons.push(v);
          return a;
        }, octiconsConfig);
    }

    return octiconsConfig;
  },

  writeWarning(message) {
    this.ui.writeWarnLine(`[ember-octicons] ${message}`);
  },
};
