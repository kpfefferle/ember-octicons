module.exports = {
  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    return this.addPackageToProject('@primer/octicons', '^16.0.0');
  },
};
