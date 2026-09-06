import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
  buildSynthesisAtlas,
  createSynthesisBrief,
  findSynthesisPath,
  searchDisciplines,
  validateSynthesisAtlas,
} from '../src/synthesis-atlas.mjs';

const source = JSON.parse(fs.readFileSync('content/atlas/disciplines.json', 'utf8'));

test('validates the public synthesis atlas and builds a connected deterministic index', () => {
  const result = validateSynthesisAtlas(source);
  assert.equal(result.ok, true, result.errors.join('\n'));
  const first = buildSynthesisAtlas(source);
  const second = buildSynthesisAtlas(structuredClone(source));
  assert.equal(first.sourceDigest, second.sourceDigest);
  assert.equal(first.summary.connectedDisciplineCount, first.summary.disciplineCount);
  assert.equal(first.policy.runtimeExecution, false);
});

test('searches across labels, domains, descriptions, and outputs', () => {
  const atlas = buildSynthesisAtlas(source);
  assert.deepEqual(searchDisciplines(atlas, 'typography').map((item) => item.id), ['visual-design']);
  assert.ok(searchDisciplines(atlas, 'science').some((item) => item.id === 'scientific-modeling'));
  assert.throws(() => searchDisciplines(atlas, '   '), /non-empty/);
});

test('finds deterministic cross-domain synthesis paths', () => {
  const atlas = buildSynthesisAtlas(source);
  assert.deepEqual(findSynthesisPath(atlas, 'visual-design', 'ai-systems'), [
    'visual-design',
    'human-experience',
    'ai-systems',
  ]);
  assert.deepEqual(findSynthesisPath(atlas, 'mathematics', 'mathematics'), ['mathematics']);
  assert.throws(() => findSynthesisPath(atlas, 'unknown', 'visual-design'), /unknown discipline/);
});

test('creates a deterministic human-reviewed synthesis brief without mutating input', () => {
  const atlas = buildSynthesisAtlas(source);
  const request = {
    challenge: 'Design a calm public learning environment',
    disciplineIds: ['visual-design', 'human-experience', 'knowledge-architecture'],
  };
  const before = structuredClone(request);
  const first = createSynthesisBrief(atlas, request);
  const second = createSynthesisBrief(atlas, structuredClone(request));
  assert.deepEqual(request, before);
  assert.deepEqual(first, second);
  assert.equal(first.crossDomain, true);
  assert.equal(first.policy.humanApprovalRequired, true);
  assert.equal(first.policy.runtimeExecutionPerformed, false);
});

test('rejects unsafe authority changes and malformed graph records', () => {
  const widened = structuredClone(source);
  widened.policy.externalWrites = true;
  assert.equal(validateSynthesisAtlas(widened).ok, false);

  const unknownConnection = structuredClone(source);
  unknownConnection.disciplines[0].connectsTo.push('missing-discipline');
  assert.match(validateSynthesisAtlas(unknownConnection).errors.join('\n'), /unknown discipline/);

  const sensitive = structuredClone(source);
  sensitive.identity.accessToken = 'not-allowed';
  assert.match(validateSynthesisAtlas(sensitive).errors.join('\n'), /sensitive-shaped key/);
});
