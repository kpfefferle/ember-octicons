import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Acceptance | css styles', function (hooks) {
  setupApplicationTest(hooks);

  test('check that Octicons scss is being applied', async function (assert) {
    await visit('/');

    let octicon = this.element.querySelector('svg.octicon');
    let octiconStyle = window.getComputedStyle(octicon);
    assert.equal(octiconStyle.getPropertyValue('display'), 'inline-block');
    assert.equal(octiconStyle.getPropertyValue('vertical-align'), 'text-top');
    assert.equal(
      octiconStyle.getPropertyValue('fill'),
      octiconStyle.getPropertyValue('color')
    );
  });
});
