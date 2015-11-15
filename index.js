/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-octicons',

  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/octicons/octicons/octicons.css');
    app.import(app.bowerDirectory + '/octicons/octicons/octicons.eot', { destDir: 'assets' });
    app.import(app.bowerDirectory + '/octicons/octicons/octicons.woff', { destDir: 'assets' });
    app.import(app.bowerDirectory + '/octicons/octicons/octicons.ttf', { destDir: 'assets' });
    app.import(app.bowerDirectory + '/octicons/octicons/octicons.svg', { destDir: 'assets' });
  }
};
