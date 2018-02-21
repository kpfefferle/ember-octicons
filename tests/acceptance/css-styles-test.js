import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { find, visit } from '@ember/test-helpers';

module('Acceptance | css styles', function(hooks) {
  setupApplicationTest(hooks);

  test('check that Octicons scss is being applied', async function(assert) {
    await visit('/');

    assert.equal(window.getComputedStyle(find('span.octicon')).getPropertyValue('display'), 'inline-block');
  });
});
