export const ATLAS_VIEW_STATE_CONTRACT_ID = 'pantechnosyni-atlas-view-state-v1';

function assertAtlas(atlas) {
  if (!atlas || atlas.contractId !== 'pantechnosyni-synthesis-atlas-v1' || !Array.isArray(atlas.disciplines)) {
    throw new Error('invalid PANTECHNOSYNI atlas');
  }
}

function assertState(state) {
  if (!state || state.contractId !== ATLAS_VIEW_STATE_CONTRACT_ID) throw new Error('invalid Atlas view state');
}

function getDiscipline(atlas, disciplineId) {
  const discipline = atlas.disciplines.find((item) => item.id === disciplineId);
  if (!discipline) throw new Error(`unknown discipline: ${disciplineId}`);
  return discipline;
}

function findPath(atlas, fromId, toId) {
  if (!fromId || !toId) return [];
  getDiscipline(atlas, fromId);
  getDiscipline(atlas, toId);
  if (fromId === toId) return [fromId];
  const byId = new Map(atlas.disciplines.map((discipline) => [discipline.id, discipline]));
  const queue = [[fromId]];
  const visited = new Set([fromId]);
  while (queue.length) {
    const path = queue.shift();
    const current = byId.get(path.at(-1));
    for (const nextId of [...current.connections].sort()) {
      if (visited.has(nextId)) continue;
      const nextPath = [...path, nextId];
      if (nextId === toId) return nextPath;
      visited.add(nextId);
      queue.push(nextPath);
    }
  }
  return [];
}

export function createAtlasViewState(atlas) {
  assertAtlas(atlas);
  const source = structuredClone(atlas);
  const selectedDisciplineId = source.disciplines[0]?.id ?? null;
  return {
    schemaVersion: 1,
    contractId: ATLAS_VIEW_STATE_CONTRACT_ID,
    atlas: source,
    query: '',
    domain: 'all',
    selectedDisciplineId,
    selectedDiscipline: selectedDisciplineId ? getDiscipline(source, selectedDisciplineId) : null,
    pathFromId: null,
    pathToId: null,
    path: [],
    pathCrossesDomains: false,
    briefDisciplineIds: [],
    policy: {
      humanApprovalRequired: true,
      runtimeExecutionPerformed: false,
      externalWritePerformed: false,
      persistenceUsed: false,
      privateDataRead: false,
    },
  };
}

export function filterAtlasDisciplines(state, filters = {}) {
  assertState(state);
  const allowed = new Set(['query', 'domain']);
  for (const [key, value] of Object.entries(filters)) {
    if (!allowed.has(key)) throw new Error(`unknown filter: ${key}`);
    if (typeof value !== 'string') throw new Error(`${key} filter must be a string`);
  }
  const query = (filters.query ?? state.query).trim().toLowerCase();
  const domain = filters.domain ?? state.domain;
  if (domain !== 'all' && !Object.hasOwn(state.atlas.domainCounts, domain)) throw new Error(`unknown domain: ${domain}`);
  return state.atlas.disciplines.filter((discipline) => {
    if (domain !== 'all' && discipline.domain !== domain) return false;
    if (!query) return true;
    return [discipline.id, discipline.label, discipline.domain, discipline.description, ...discipline.outputs]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });
}

export function updateAtlasFilters(state, { query = state.query, domain = state.domain } = {}) {
  assertState(state);
  if (typeof query !== 'string') throw new Error('query filter must be a string');
  if (domain !== 'all' && !Object.hasOwn(state.atlas.domainCounts, domain)) throw new Error(`unknown domain: ${domain}`);
  return { ...structuredClone(state), query, domain };
}

export function selectAtlasDiscipline(state, disciplineId) {
  assertState(state);
  const selectedDiscipline = getDiscipline(state.atlas, disciplineId);
  return {
    ...structuredClone(state),
    selectedDisciplineId: disciplineId,
    selectedDiscipline: structuredClone(selectedDiscipline),
  };
}

export function setAtlasPathEndpoint(state, endpoint, disciplineId) {
  assertState(state);
  if (!['from', 'to'].includes(endpoint)) throw new Error('endpoint must be from or to');
  getDiscipline(state.atlas, disciplineId);
  const next = structuredClone(state);
  if (endpoint === 'from') next.pathFromId = disciplineId;
  else next.pathToId = disciplineId;
  next.path = findPath(next.atlas, next.pathFromId, next.pathToId);
  const byId = new Map(next.atlas.disciplines.map((discipline) => [discipline.id, discipline]));
  next.pathCrossesDomains = new Set(next.path.map((id) => byId.get(id).domain)).size > 1;
  return next;
}

export function toggleAtlasBriefDiscipline(state, disciplineId) {
  assertState(state);
  getDiscipline(state.atlas, disciplineId);
  const selected = new Set(state.briefDisciplineIds);
  if (selected.has(disciplineId)) selected.delete(disciplineId);
  else {
    if (selected.size >= 6) throw new Error('a synthesis brief accepts a maximum of six disciplines');
    selected.add(disciplineId);
  }
  return { ...structuredClone(state), briefDisciplineIds: [...selected].sort() };
}

export function createAtlasBriefPreview(state, challenge) {
  assertState(state);
  if (typeof challenge !== 'string' || challenge.trim().length < 8) throw new Error('challenge must contain at least eight characters');
  if (state.briefDisciplineIds.length < 2 || state.briefDisciplineIds.length > 6) {
    throw new Error('select between two and six disciplines');
  }
  const disciplines = state.briefDisciplineIds.map((id) => getDiscipline(state.atlas, id));
  const domains = [...new Set(disciplines.map((discipline) => discipline.domain))].sort();
  const recommendedOutputs = [...new Set(disciplines.flatMap((discipline) => discipline.outputs))].sort();
  return {
    schemaVersion: 1,
    contractId: 'pantechnosyni-synthesis-brief-preview-v1',
    challenge: challenge.trim(),
    status: 'ready-for-human-direction',
    disciplines: disciplines.map(({ id, label, domain }) => ({ id, label, domain })),
    domains,
    crossDomain: domains.length > 1,
    recommendedOutputs,
    reviewQuestions: [
      'What human need is this synthesis serving?',
      'Which claim requires evidence before publication?',
      'What should remain intentionally outside scope?',
      'How will accessibility and cultural context be reviewed?',
    ],
    policy: {
      generatedFromPublicMetadata: true,
      humanApprovalRequired: true,
      runtimeExecutionPerformed: false,
      externalWritePerformed: false,
      persistenceUsed: false,
    },
  };
}

export function summarizeAtlasViewState(state) {
  assertState(state);
  return {
    disciplineCount: state.atlas.summary.disciplineCount,
    domainCount: state.atlas.summary.domainCount,
    visibleDisciplineCount: filterAtlasDisciplines(state).length,
    selectedDisciplineId: state.selectedDisciplineId,
    pathLength: state.path.length,
    pathCrossesDomains: state.pathCrossesDomains,
    selectedBriefDisciplineCount: state.briefDisciplineIds.length,
    sourceDigest: state.atlas.sourceDigest,
  };
}
