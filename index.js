'use strict';

var Funnel = require('broccoli-funnel');
var fs = require('fs');
var glob = require('glob');

var octiconsDir = 'node_modules/octicons';

module.exports = {
  name: 'ember-octicons',
  octiconsConfig: null,

  included(app) {
    this._super.included(app);

    this.octiconsConfig = this.buildConfig();

    // Import SVG icons
    if (this.octiconsConfig.icons !== null) {
      let destDir = this.octiconsConfig.destDir || 'images/svg/octicons';
      this.octiconsConfig.icons.forEach(icon => {
        let iconPath = `node_modules/octicons/build/svg/${icon}.svg`;
        if (fs.existsSync(iconPath)) {
          app.import(`node_modules/octicons/build/svg/${icon}.svg`, { destDir });
        } else {
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
      }
    });
  },

  buildConfig() {
    let config = (this.app && this.app.options) || {};
    let octiconsConfig = config['octicons'] || {
      destDir: null,
      icons: []
    };

    if(octiconsConfig.icons !== null && octiconsConfig.icons.length === 0) {
      this.writeWarning('No octicons were specified in ember-cli-build; defaulting to all icons');

      glob.sync('node_modules/octicons/build/svg/*.svg')
        .map(i => i.split('/').pop())
        .map(i => i.replace(/\.svg$/i, ''))
        .reduce((a, v) => {
          a.icons.push(v);
          return a;
        }, octiconsConfig);
    }

    return octiconsConfig;
  },

  writeWarning(message) {
    this.ui.writeWarnLine(`[ember-octicons] ${message}`);
  }
};
