import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Acceptance | css styles', function (hooks) {
  setupApplicationTest(hooks);

  test('check that Octicons scss is being applied', async function (assert) {
    await visit('/');

    let octicon = this.element.querySelector('svg.octicon');
    let octiconStyle = window.getComputedStyle(octicon);
    assert.strictEqual(
      octiconStyle.getPropertyValue('display'),
      'inline-block',
    );
    assert.strictEqual(
      octiconStyle.getPropertyValue('vertical-align'),
      'text-top',
    );
    assert.strictEqual(
      octiconStyle.getPropertyValue('fill'),
      octiconStyle.getPropertyValue('color'),
    );
  });
});
