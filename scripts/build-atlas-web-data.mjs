import fs from 'node:fs';
import { buildSynthesisAtlas } from '../src/synthesis-atlas.mjs';

const sourcePath = 'content/atlas/disciplines.json';
const outputPath = 'apps/web/atlas-data.js';
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const atlas = buildSynthesisAtlas(source);
const output = `// Generated from ${sourcePath}. Do not edit by hand.\nexport const atlasWebData = ${JSON.stringify(atlas, null, 2)};\n`;

if (process.argv.includes('--check')) {
  if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, 'utf8') !== output) {
    console.error(`atlas-web-data: stale or missing ${outputPath}`);
    process.exit(1);
  }
  console.log(`atlas-web-data: ok (${atlas.summary.disciplineCount} disciplines, ${atlas.sourceDigest})`);
} else {
  fs.mkdirSync('apps/web', { recursive: true });
  fs.writeFileSync(outputPath, output);
  console.log(`atlas-web-data: wrote ${outputPath}`);
}
