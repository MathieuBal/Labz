import test from 'node:test';
import assert from 'node:assert/strict';
import {validateReleaseChange, requiresRelease} from '../scripts/release-change.mjs';

test('application changes cannot reuse a previously published version', () => {
  assert.throws(() => validateReleaseChange(['app.js'], '0.9.1', '0.9.1', false));
  assert.throws(() => validateReleaseChange(['app.js','release-notes.js'], '0.9.1', '0.9.1', true));
  assert.throws(() => validateReleaseChange(['app.js'], '0.9.1', '0.10.0', false));
  assert.doesNotThrow(() => validateReleaseChange(['app.js','release-notes.js'], '0.9.1', '0.10.0', true));
});
test('only prose documentation is exempt, including mixed changes and removals', () => {
  assert.equal(requiresRelease(['README.md','docs/development-plan.md']), false);
  assert.equal(requiresRelease(['docs/example.js']), true);
  assert.equal(requiresRelease(['README.md','supabase/migrations/a.sql']), true);
  assert.equal(requiresRelease(['.github/workflows/check.yml']), true);
  assert.doesNotThrow(() => validateReleaseChange(['README.md'], '0.9.1', '0.9.1', false));
});
