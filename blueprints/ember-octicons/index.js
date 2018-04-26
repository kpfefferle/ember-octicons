module.exports = {
  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    return this.addPackageToProject('octicons', '^7.2.0');
  }
}
