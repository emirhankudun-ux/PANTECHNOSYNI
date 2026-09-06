import fs from 'node:fs';
import { buildSynthesisAtlas, validateSynthesisAtlas } from '../src/synthesis-atlas.mjs';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const errors = [];
const manifest = readJson('project.pantechnosyni.json');
const atlasSource = readJson('content/atlas/disciplines.json');
const atlasResult = validateSynthesisAtlas(atlasSource);
errors.push(...atlasResult.errors.map((error) => `atlas: ${error}`));

if (manifest.schemaVersion !== 1) errors.push('manifest schemaVersion must be 1');
if (manifest.project?.id !== 'pantechnosyni') errors.push('manifest project id must be pantechnosyni');
if (manifest.project?.displayName !== 'PANTECHNOSYNI') errors.push('manifest display name must be PANTECHNOSYNI');
if (manifest.project?.greekName !== 'ΠΑΝΤΕΧΝΟΣΥΝΗ') errors.push('manifest Greek name must be ΠΑΝΤΕΧΝΟΣΥΝΗ');
if (manifest.project?.repository !== 'emirhankudun-ux/PANTECHNOSYNI') errors.push('manifest repository is incorrect');
if (manifest.project?.visibility !== 'public') errors.push('manifest visibility must be public');
if (manifest.project?.productClass !== 'interdisciplinary-synthesis-system') errors.push('manifest product class is incorrect');
if (manifest.ownership?.owns?.length < 4) errors.push('manifest must declare at least four owned domains');
if (manifest.ownership?.doesNotOwn?.length < 4) errors.push('manifest must declare explicit non-ownership boundaries');
if (new Set(manifest.ownership?.owns ?? []).size !== (manifest.ownership?.owns ?? []).length) errors.push('owned domains must be unique');
if (new Set(manifest.ownership?.doesNotOwn ?? []).size !== (manifest.ownership?.doesNotOwn ?? []).length) errors.push('non-ownership domains must be unique');
for (const [key, expected] of Object.entries({ publicSafe: true, runtimeExecution: false, externalWrites: false, privateData: false, automaticClaims: false })) {
  if (manifest.policy?.[key] !== expected) errors.push(`manifest policy.${key} must be ${expected}`);
}

for (const path of [
  'README.md',
  'AGENTS.md',
  'LICENSE',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'docs/ARCHITECTURE.md',
  'docs/ROADMAP.md',
  'src/synthesis-atlas.mjs',
  'scripts/pantechnosyni-atlas.mjs',
  'test/synthesis-atlas.test.mjs',
  '.github/workflows/ci.yml',
]) {
  if (!fs.existsSync(path)) errors.push(`missing foundation artifact: ${path}`);
}

if (atlasResult.ok) {
  const atlas = buildSynthesisAtlas(atlasSource);
  if (atlas.summary.disciplineCount < 8) errors.push('atlas discipline count is below foundation minimum');
  if (atlas.summary.connectedDisciplineCount !== atlas.summary.disciplineCount) errors.push('atlas graph is not connected');
  if (atlas.policy.runtimeExecution !== false || atlas.policy.externalWrites !== false) errors.push('atlas authority boundary widened');
}

const raw = [JSON.stringify(manifest), JSON.stringify(atlasSource)].join('\n');
if (/(?:^|[^A-Za-z0-9])(ghp_|github_pat_|sk-[A-Za-z0-9]{12,}|BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY)/.test(raw)) errors.push('sensitive-shaped literal detected');

if (errors.length) {
  console.error('pantechnosyni-foundation: failed');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`pantechnosyni-foundation: ok (${atlasSource.disciplines.length} disciplines, independent public product)`);
