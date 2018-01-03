import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | css styles');

test('check that Octicons scss is being applied', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(find('span.octicon').css('display'), 'inline-block');
  });
});
