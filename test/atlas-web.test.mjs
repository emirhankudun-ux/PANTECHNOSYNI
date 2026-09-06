import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { buildSynthesisAtlas, findSynthesisPath } from '../src/synthesis-atlas.mjs';
import { atlasWebData } from '../apps/web/atlas-data.js';
import {
  createAtlasBriefPreview,
  createAtlasViewState,
  filterAtlasDisciplines,
  selectAtlasDiscipline,
  setAtlasPathEndpoint,
  summarizeAtlasViewState,
  toggleAtlasBriefDiscipline,
} from '../apps/web/atlas-model.mjs';

const source = JSON.parse(fs.readFileSync('content/atlas/disciplines.json', 'utf8'));
const coreAtlas = buildSynthesisAtlas(source);

test('generated browser data stays in parity with the canonical synthesis atlas', () => {
  assert.equal(atlasWebData.contractId, coreAtlas.contractId);
  assert.equal(atlasWebData.sourceDigest, coreAtlas.sourceDigest);
  assert.deepEqual(atlasWebData.summary, coreAtlas.summary);
  assert.deepEqual(atlasWebData.disciplines, coreAtlas.disciplines);
  assert.equal(atlasWebData.policy.externalWrites, false);
});

test('filters and selects disciplines without mutating the view state', () => {
  const state = createAtlasViewState(atlasWebData);
  const before = structuredClone(state);
  assert.deepEqual(filterAtlasDisciplines(state, { query: 'typography' }).map((item) => item.id), ['visual-design']);
  assert.ok(filterAtlasDisciplines(state, { domain: 'science' }).every((item) => item.domain === 'science'));
  const selected = selectAtlasDiscipline(state, 'human-experience');
  assert.equal(selected.selectedDisciplineId, 'human-experience');
  assert.deepEqual(state, before);
  assert.throws(() => filterAtlasDisciplines(state, { domain: 'unknown' }), /unknown domain/);
});

test('builds deterministic path state matching the canonical graph', () => {
  let state = createAtlasViewState(atlasWebData);
  state = setAtlasPathEndpoint(state, 'from', 'visual-design');
  state = setAtlasPathEndpoint(state, 'to', 'ai-systems');
  assert.deepEqual(state.path, findSynthesisPath(coreAtlas, 'visual-design', 'ai-systems'));
  assert.equal(state.pathCrossesDomains, true);
  assert.throws(() => setAtlasPathEndpoint(state, 'middle', 'mathematics'), /endpoint must be from or to/);
});

test('creates a session-only synthesis preview with bounded discipline selection', () => {
  let state = createAtlasViewState(atlasWebData);
  for (const id of ['visual-design', 'human-experience', 'knowledge-architecture']) {
    state = toggleAtlasBriefDiscipline(state, id);
  }
  const preview = createAtlasBriefPreview(state, 'Design a calm public learning environment');
  assert.equal(preview.status, 'ready-for-human-direction');
  assert.equal(preview.disciplines.length, 3);
  assert.equal(preview.policy.humanApprovalRequired, true);
  assert.equal(preview.policy.externalWritePerformed, false);
  assert.equal(summarizeAtlasViewState(state).selectedBriefDisciplineCount, 3);

  for (const id of ['product-strategy', 'software-engineering', 'systems-thinking']) {
    state = toggleAtlasBriefDiscipline(state, id);
  }
  assert.throws(() => toggleAtlasBriefDiscipline(state, 'mathematics'), /maximum of six/);
});

test('ships a semantic, keyboard-ready, responsive and reduced-motion web surface', () => {
  const html = fs.readFileSync('apps/web/index.html', 'utf8');
  const css = fs.readFileSync('apps/web/styles.css', 'utf8');
  const js = fs.readFileSync('apps/web/app.js', 'utf8');
  const data = fs.readFileSync('apps/web/atlas-data.js', 'utf8');

  for (const marker of [
    'href="#mainContent"',
    'id="mainContent"',
    'id="atlasSearch"',
    'aria-label="Filter by domain"',
    'id="disciplineList"',
    'id="disciplineInspector"',
    'id="pathResult"',
    'id="briefPreview"',
    'aria-live="polite"',
  ]) assert.ok(html.includes(marker), `missing HTML marker: ${marker}`);

  assert.ok(css.includes(':focus-visible'));
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'));
  assert.ok(css.includes('@media (max-width:'));
  assert.doesNotMatch([html, css, js, data].join('\n'), /localStorage|sessionStorage|fetch\(|XMLHttpRequest|WebSocket|EventSource/);
});
