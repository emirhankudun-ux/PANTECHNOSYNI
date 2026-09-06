import { createHash } from 'node:crypto';

export const ATLAS_CONTRACT_ID = 'pantechnosyni-synthesis-atlas-v1';

const REQUIRED_POLICY = Object.freeze({
  runtimeExecution: false,
  externalWrites: false,
  privateData: false,
  automaticClaims: false,
});

const ALLOWED_DOMAINS = new Set([
  'creative',
  'creative-technology',
  'product',
  'human',
  'technology',
  'knowledge',
  'science',
  'humanities',
]);

const SECRET_KEY = /(api.?key|access.?token|password|private.?key|client.?secret|credential|secret)/i;
const SECRET_VALUE = /(ghp_[A-Za-z0-9]{8,}|github_pat_[A-Za-z0-9_]{8,}|sk-[A-Za-z0-9]{12,}|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY)/;

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (isObject(value)) {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function digest(value) {
  return createHash('sha256').update(JSON.stringify(canonicalize(value))).digest('hex');
}

function scanSensitive(value, trail, errors) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanSensitive(item, [...trail, String(index)], errors));
    return;
  }
  if (isObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      if (SECRET_KEY.test(key)) errors.push(`sensitive-shaped key is forbidden: ${[...trail, key].join('.')}`);
      scanSensitive(child, [...trail, key], errors);
    }
    return;
  }
  if (typeof value === 'string' && SECRET_VALUE.test(value)) {
    errors.push(`sensitive-shaped value is forbidden: ${trail.join('.') || 'root'}`);
  }
}

function validIdentifier(value) {
  return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function validStringList(value, label, errors, minimum = 1) {
  if (!Array.isArray(value) || value.length < minimum) {
    errors.push(`${label} must contain at least ${minimum} item(s)`);
    return [];
  }
  const seen = new Set();
  value.forEach((item, index) => {
    if (typeof item !== 'string' || item.trim() !== item || item.length === 0) {
      errors.push(`${label}[${index}] must be a non-empty trimmed string`);
      return;
    }
    if (seen.has(item)) errors.push(`${label} contains duplicate value: ${item}`);
    seen.add(item);
  });
  return value;
}

export function validateSynthesisAtlas(atlas) {
  const errors = [];
  if (!isObject(atlas)) return { ok: false, errors: ['atlas must be an object'] };
  scanSensitive(atlas, [], errors);

  if (atlas.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (atlas.atlasId !== ATLAS_CONTRACT_ID) errors.push(`atlasId must be ${ATLAS_CONTRACT_ID}`);
  if (atlas.identity?.displayName !== 'PANTECHNOSYNI') errors.push('identity.displayName must be PANTECHNOSYNI');
  if (atlas.identity?.greekName !== 'ΠΑΝΤΕΧΝΟΣΥΝΗ') errors.push('identity.greekName must be ΠΑΝΤΕΧΝΟΣΥΝΗ');
  if (atlas.identity?.mode !== 'public-foundation') errors.push('identity.mode must remain public-foundation');
  validStringList(atlas.principles, 'principles', errors, 4);

  for (const [key, expected] of Object.entries(REQUIRED_POLICY)) {
    if (atlas.policy?.[key] !== expected) errors.push(`policy.${key} must be ${expected}`);
  }

  if (!Array.isArray(atlas.disciplines) || atlas.disciplines.length < 8) {
    errors.push('disciplines must contain at least eight entries');
    return { ok: false, errors };
  }

  const byId = new Map();
  atlas.disciplines.forEach((discipline, index) => {
    const label = `disciplines[${index}]`;
    if (!isObject(discipline)) {
      errors.push(`${label} must be an object`);
      return;
    }
    if (!validIdentifier(discipline.id)) errors.push(`${label}.id must be a lowercase hyphenated identifier`);
    if (byId.has(discipline.id)) errors.push(`duplicate discipline id: ${discipline.id}`);
    byId.set(discipline.id, discipline);
    if (typeof discipline.label !== 'string' || discipline.label.trim().length < 2) errors.push(`${label}.label is invalid`);
    if (!ALLOWED_DOMAINS.has(discipline.domain)) errors.push(`${label}.domain is not allowed: ${discipline.domain}`);
    if (typeof discipline.description !== 'string' || discipline.description.trim().length < 24) errors.push(`${label}.description is too short`);
    validStringList(discipline.outputs, `${label}.outputs`, errors, 2);
    validStringList(discipline.connectsTo, `${label}.connectsTo`, errors, 2);
  });

  for (const discipline of atlas.disciplines) {
    for (const targetId of discipline.connectsTo ?? []) {
      if (!byId.has(targetId)) errors.push(`${discipline.id} connects to unknown discipline: ${targetId}`);
      if (targetId === discipline.id) errors.push(`${discipline.id} cannot connect to itself`);
    }
  }

  const domains = new Set(atlas.disciplines.map((discipline) => discipline.domain));
  if (domains.size < 6) errors.push('atlas must span at least six domains');

  if (errors.length === 0) {
    const index = buildSynthesisAtlas(atlas, { skipValidation: true });
    if (index.summary.connectedDisciplineCount !== atlas.disciplines.length) {
      errors.push('discipline graph must be fully connected');
    }
  }

  return { ok: errors.length === 0, errors };
}

export function buildSynthesisAtlas(atlas, { skipValidation = false } = {}) {
  const source = structuredClone(atlas);
  if (!skipValidation) {
    const result = validateSynthesisAtlas(source);
    if (!result.ok) throw new Error(`Invalid ${ATLAS_CONTRACT_ID}:\n- ${result.errors.join('\n- ')}`);
  }

  const byId = new Map(source.disciplines.map((discipline) => [discipline.id, discipline]));
  const adjacency = new Map([...byId.keys()].map((id) => [id, new Set()]));
  for (const discipline of source.disciplines) {
    for (const targetId of discipline.connectsTo) {
      adjacency.get(discipline.id).add(targetId);
      adjacency.get(targetId)?.add(discipline.id);
    }
  }

  const firstId = [...byId.keys()].sort()[0];
  const visited = new Set();
  const queue = firstId ? [firstId] : [];
  while (queue.length) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    queue.push(...[...(adjacency.get(current) ?? [])].filter((id) => !visited.has(id)).sort());
  }

  const disciplines = [...byId.values()]
    .map((discipline) => ({
      ...discipline,
      outputs: [...discipline.outputs].sort(),
      connections: [...adjacency.get(discipline.id)].sort(),
      connectionCount: adjacency.get(discipline.id).size,
    }))
    .sort((left, right) => left.id.localeCompare(right.id));

  const domainCounts = Object.fromEntries(
    [...new Set(disciplines.map((discipline) => discipline.domain))]
      .sort()
      .map((domain) => [domain, disciplines.filter((discipline) => discipline.domain === domain).length]),
  );

  return {
    schemaVersion: 1,
    contractId: ATLAS_CONTRACT_ID,
    sourceDigest: `sha256:${digest(source)}`,
    identity: structuredClone(source.identity),
    principles: [...source.principles],
    summary: {
      disciplineCount: disciplines.length,
      domainCount: Object.keys(domainCounts).length,
      connectionCount: [...adjacency.values()].reduce((total, connections) => total + connections.size, 0) / 2,
      connectedDisciplineCount: visited.size,
    },
    domainCounts,
    disciplines,
    policy: structuredClone(source.policy),
  };
}

export function searchDisciplines(index, query) {
  if (!index || index.contractId !== ATLAS_CONTRACT_ID) throw new Error('invalid synthesis atlas index');
  if (typeof query !== 'string' || query.trim().length === 0) throw new Error('query must be a non-empty string');
  const normalized = query.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  return index.disciplines.filter((discipline) => {
    const haystack = [discipline.id, discipline.label, discipline.domain, discipline.description, ...discipline.outputs]
      .join(' ')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export function findSynthesisPath(index, fromId, toId) {
  if (!index || index.contractId !== ATLAS_CONTRACT_ID) throw new Error('invalid synthesis atlas index');
  const byId = new Map(index.disciplines.map((discipline) => [discipline.id, discipline]));
  if (!byId.has(fromId)) throw new Error(`unknown discipline: ${fromId}`);
  if (!byId.has(toId)) throw new Error(`unknown discipline: ${toId}`);
  if (fromId === toId) return [fromId];

  const queue = [[fromId]];
  const visited = new Set([fromId]);
  while (queue.length) {
    const path = queue.shift();
    const current = byId.get(path[path.length - 1]);
    for (const nextId of [...current.connections].sort()) {
      if (visited.has(nextId)) continue;
      const nextPath = [...path, nextId];
      if (nextId === toId) return nextPath;
      visited.add(nextId);
      queue.push(nextPath);
    }
  }
  return null;
}

export function createSynthesisBrief(index, { challenge, disciplineIds }) {
  if (!index || index.contractId !== ATLAS_CONTRACT_ID) throw new Error('invalid synthesis atlas index');
  if (typeof challenge !== 'string' || challenge.trim().length < 8) throw new Error('challenge must contain at least eight characters');
  if (!Array.isArray(disciplineIds) || disciplineIds.length < 2 || disciplineIds.length > 6) {
    throw new Error('disciplineIds must contain between two and six entries');
  }
  const uniqueIds = [...new Set(disciplineIds)];
  if (uniqueIds.length !== disciplineIds.length) throw new Error('disciplineIds must be unique');

  const byId = new Map(index.disciplines.map((discipline) => [discipline.id, discipline]));
  const selected = uniqueIds.map((id) => {
    const discipline = byId.get(id);
    if (!discipline) throw new Error(`unknown discipline: ${id}`);
    return discipline;
  });
  const domains = [...new Set(selected.map((discipline) => discipline.domain))].sort();
  const outputs = [...new Set(selected.flatMap((discipline) => discipline.outputs))].sort();

  return {
    schemaVersion: 1,
    briefId: `synthesis-${digest({ challenge: challenge.trim(), disciplineIds: [...uniqueIds].sort() }).slice(0, 12)}`,
    challenge: challenge.trim(),
    status: 'ready-for-human-direction',
    disciplines: selected.map((discipline) => ({ id: discipline.id, label: discipline.label, domain: discipline.domain })),
    domains,
    crossDomain: domains.length > 1,
    recommendedOutputs: outputs,
    reviewQuestions: [
      'What human need is this synthesis serving?',
      'Which claim requires evidence before publication?',
      'What should remain intentionally outside scope?',
      'How will accessibility and cultural context be reviewed?'
    ],
    policy: {
      generatedFromPublicMetadata: true,
      humanApprovalRequired: true,
      runtimeExecutionPerformed: false,
      externalWritePerformed: false
    }
  };
}
