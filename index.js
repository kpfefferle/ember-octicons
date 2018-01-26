'use strict';

module.exports = {
  name: 'ember-octicons',

  included: function(app) {
    this._super.included(app);

    app.import('node_modules/octicons/build/font/octicons.css');
    app.import('node_modules/octicons/build/font/octicons.eot', { destDir: 'assets' });
    app.import('node_modules/octicons/build/font/octicons.woff2', { destDir: 'assets' });
    app.import('node_modules/octicons/build/font/octicons.woff', { destDir: 'assets' });
    app.import('node_modules/octicons/build/font/octicons.ttf', { destDir: 'assets' });
    app.import('node_modules/octicons/build/font/octicons.svg', { destDir: 'assets' });
  }
};
