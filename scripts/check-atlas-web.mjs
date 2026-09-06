import fs from 'node:fs';
import { buildSynthesisAtlas } from '../src/synthesis-atlas.mjs';
import { atlasWebData } from '../apps/web/atlas-data.js';
import {
  createAtlasBriefPreview,
  createAtlasViewState,
  filterAtlasDisciplines,
  setAtlasPathEndpoint,
  toggleAtlasBriefDiscipline,
} from '../apps/web/atlas-model.mjs';

const errors = [];
const source = JSON.parse(fs.readFileSync('content/atlas/disciplines.json', 'utf8'));
const expected = buildSynthesisAtlas(source);
if (JSON.stringify(atlasWebData) !== JSON.stringify(expected)) errors.push('generated browser data does not match the canonical Atlas');

let state = createAtlasViewState(atlasWebData);
if (filterAtlasDisciplines(state, { query: 'typography' }).map((item) => item.id).join(',') !== 'visual-design') errors.push('Atlas text search drifted');
state = setAtlasPathEndpoint(state, 'from', 'visual-design');
state = setAtlasPathEndpoint(state, 'to', 'ai-systems');
if (state.path.join('>') !== 'visual-design>human-experience>ai-systems') errors.push('Atlas path behavior drifted');
for (const id of ['visual-design', 'human-experience', 'knowledge-architecture']) state = toggleAtlasBriefDiscipline(state, id);
const preview = createAtlasBriefPreview(state, 'Design a calm public learning environment');
if (preview.status !== 'ready-for-human-direction' || preview.policy.humanApprovalRequired !== true) errors.push('Atlas synthesis preview boundary drifted');
if (preview.policy.externalWritePerformed !== false || preview.policy.persistenceUsed !== false) errors.push('Atlas synthesis preview authority widened');

const html = fs.readFileSync('apps/web/index.html', 'utf8');
const css = fs.readFileSync('apps/web/styles.css', 'utf8');
const js = fs.readFileSync('apps/web/app.js', 'utf8');
for (const marker of ['href="#mainContent"', 'id="mainContent"', 'id="atlasSearch"', 'aria-label="Filter by domain"', 'id="disciplineList"', 'id="disciplineInspector"', 'id="pathResult"', 'id="briefPreview"', 'aria-live="polite"']) {
  if (!html.includes(marker)) errors.push(`missing Atlas web marker: ${marker}`);
}
if (!css.includes(':focus-visible')) errors.push('Atlas web must define visible keyboard focus');
if (!css.includes('@media (prefers-reduced-motion: reduce)')) errors.push('Atlas web must define reduced-motion behavior');
if (!css.includes('@media (max-width:')) errors.push('Atlas web must define responsive behavior');
if (/localStorage|sessionStorage|fetch\(|XMLHttpRequest|WebSocket|EventSource/.test([html, css, js].join('\n'))) errors.push('Atlas web must remain no-network and no-storage');

for (const path of ['docs/ARCHITECTURE_ATLAS_WEB.md', 'test/atlas-web.test.mjs', '.github/workflows/atlas-web.yml']) {
  if (!fs.existsSync(path)) errors.push(`missing Atlas web artifact: ${path}`);
}

if (errors.length) {
  console.error('pantechnosyni-atlas-web: failed');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`pantechnosyni-atlas-web: ok (${expected.summary.disciplineCount} disciplines, ${expected.summary.domainCount} domains, no network)`);
