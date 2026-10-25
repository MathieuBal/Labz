import test from 'node:test';
import assert from 'node:assert/strict';
import {projects} from '../catalog.js';
import {validateSubmission} from '../supabase/functions/labz-feedback/handler.js';

const base = {
  kind:'idea',
  summary:'Une idée',
  message:'Voici un retour valide.',
  nickname:'',
  website:'',
  requestId:'12345678-1234-4123-8123-123456789abc',
};

test('chaque projet actif du catalogue est accepté par le contrat feedback', () => {
  assert.equal(projects.length, 12);
  for (const project of projects) {
    const submission = validateSubmission({...base, project:project.id});
    assert.ok(submission, `Feedback rejeté pour ${project.id}`);
    assert.equal(submission.p_project, project.id);
  }
});

test('le contrat feedback accepte des slugs propres sans maintenir de whitelist parallèle', () => {
  assert.ok(validateSubmission({...base, project:'nouveau-projet'}));
  for (const project of ['', '-mauvais', 'mauvais-', 'AvecMajuscule', 'espace interdit', 'a'.repeat(65)]) {
    assert.equal(validateSubmission({...base, project}), null);
  }
});
