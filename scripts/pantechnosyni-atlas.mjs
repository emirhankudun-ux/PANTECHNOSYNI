import fs from 'node:fs';
import {
  buildSynthesisAtlas,
  createSynthesisBrief,
  findSynthesisPath,
  searchDisciplines,
} from '../src/synthesis-atlas.mjs';

const atlas = buildSynthesisAtlas(JSON.parse(fs.readFileSync('content/atlas/disciplines.json', 'utf8')));
const [command = 'summary', ...args] = process.argv.slice(2);

const print = (value) => console.log(typeof value === 'string' ? value : JSON.stringify(value, null, 2));

switch (command) {
  case 'summary':
    print(`PANTECHNOSYNI Atlas — ${atlas.summary.disciplineCount} disciplines, ${atlas.summary.domainCount} domains, ${atlas.summary.connectionCount} connections`);
    break;
  case 'json':
    print(atlas);
    break;
  case 'disciplines':
    print(atlas.disciplines.map(({ id, label, domain }) => ({ id, label, domain })));
    break;
  case 'search':
    print(searchDisciplines(atlas, args.join(' ')));
    break;
  case 'path':
    if (args.length !== 2) throw new Error('usage: path <from-id> <to-id>');
    print(findSynthesisPath(atlas, args[0], args[1]));
    break;
  case 'brief': {
    if (args.length < 3) throw new Error('usage: brief <challenge> -- <discipline-id> [discipline-id...]');
    const separator = args.indexOf('--');
    if (separator < 1 || separator === args.length - 1) throw new Error('usage: brief <challenge> -- <discipline-id> [discipline-id...]');
    print(createSynthesisBrief(atlas, {
      challenge: args.slice(0, separator).join(' '),
      disciplineIds: args.slice(separator + 1),
    }));
    break;
  }
  default:
    throw new Error(`unknown command: ${command}`);
}
