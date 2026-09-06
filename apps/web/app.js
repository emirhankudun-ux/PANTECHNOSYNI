import { atlasWebData } from './atlas-data.js';
import {
  createAtlasBriefPreview,
  createAtlasViewState,
  filterAtlasDisciplines,
  selectAtlasDiscipline,
  setAtlasPathEndpoint,
  summarizeAtlasViewState,
  toggleAtlasBriefDiscipline,
  updateAtlasFilters,
} from './atlas-model.mjs';

let state = createAtlasViewState(atlasWebData);
const byId = (id) => document.getElementById(id);
const titleCase = (value) => value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

function renderSummary() {
  const summary = summarizeAtlasViewState(state);
  byId('disciplineMetric').textContent = String(summary.disciplineCount);
  byId('domainMetric').textContent = String(summary.domainCount);
  byId('connectionMetric').textContent = String(state.atlas.summary.connectionCount);
  byId('sourceDigest').textContent = state.atlas.sourceDigest;
}

function populateControls() {
  const domains = Object.entries(state.atlas.domainCounts);
  byId('domainFilter').replaceChildren(
    new Option('All domains', 'all'),
    ...domains.map(([domain, count]) => new Option(`${titleCase(domain)} · ${count}`, domain)),
  );
  byId('domainList').replaceChildren(...domains.map(([domain, count]) => {
    const row = document.createElement('div');
    row.className = 'domain-row';
    row.setAttribute('role', 'listitem');
    row.innerHTML = `<strong>${titleCase(domain)}</strong><span>${count}</span>`;
    return row;
  }));

  for (const select of [byId('pathFrom'), byId('pathTo')]) {
    select.replaceChildren(new Option('Choose a discipline', ''), ...state.atlas.disciplines.map((discipline) => new Option(discipline.label, discipline.id)));
  }
  byId('pathFrom').value = 'visual-design';
  byId('pathTo').value = 'ai-systems';
  state = setAtlasPathEndpoint(state, 'from', 'visual-design');
  state = setAtlasPathEndpoint(state, 'to', 'ai-systems');
}

function renderDisciplines() {
  const visible = filterAtlasDisciplines(state);
  byId('atlasStatus').textContent = `${visible.length} of ${state.atlas.summary.disciplineCount} disciplines shown.`;
  byId('disciplineList').replaceChildren(...visible.map((discipline, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'discipline-row';
    button.setAttribute('role', 'listitem');
    button.setAttribute('aria-current', String(discipline.id === state.selectedDisciplineId));
    button.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><strong>${discipline.label}</strong><p>${discipline.description}</p><small>${titleCase(discipline.domain)}</small>`;
    button.addEventListener('click', () => {
      state = selectAtlasDiscipline(state, discipline.id);
      renderDisciplines();
      renderInspector();
    });
    return button;
  }));
}

function renderInspector() {
  const discipline = state.selectedDiscipline;
  byId('inspectorDomain').textContent = titleCase(discipline.domain);
  byId('inspectorName').textContent = discipline.label;
  byId('inspectorDescription').textContent = discipline.description;
  byId('outputList').replaceChildren(...discipline.outputs.map((output) => {
    const item = document.createElement('li');
    item.textContent = titleCase(output);
    return item;
  }));
  const byDiscipline = new Map(state.atlas.disciplines.map((item) => [item.id, item]));
  byId('connectionList').replaceChildren(...discipline.connections.map((connectionId) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = byDiscipline.get(connectionId).label;
    button.addEventListener('click', () => {
      state = selectAtlasDiscipline(state, connectionId);
      renderDisciplines();
      renderInspector();
    });
    return button;
  }));
}

function renderPath() {
  const result = byId('pathResult');
  if (!state.path.length) {
    result.innerHTML = '<p class="path-empty">Choose two disciplines to reveal their shortest public graph path.</p>';
    return;
  }
  const byDiscipline = new Map(state.atlas.disciplines.map((discipline) => [discipline.id, discipline]));
  result.replaceChildren(...state.path.map((id) => {
    const node = document.createElement('span');
    node.className = 'path-node';
    node.textContent = byDiscipline.get(id).label;
    return node;
  }));
  result.setAttribute('aria-label', `Path: ${state.path.map((id) => byDiscipline.get(id).label).join(' to ')}`);
}

function renderBriefChoices() {
  byId('briefDisciplineList').replaceChildren(...state.atlas.disciplines.map((discipline) => {
    const selected = state.briefDisciplineIds.includes(discipline.id);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = discipline.label;
    button.setAttribute('aria-pressed', String(selected));
    button.addEventListener('click', () => {
      try {
        state = toggleAtlasBriefDiscipline(state, discipline.id);
        renderBriefChoices();
        byId('briefStatus').textContent = `${state.briefDisciplineIds.length} selected. Choose between two and six disciplines.`;
      } catch (error) {
        byId('briefStatus').textContent = error.message;
      }
    });
    return button;
  }));
}

function renderBriefPreview(preview) {
  byId('previewTitle').textContent = preview.crossDomain ? 'Cross-domain synthesis' : 'Focused synthesis';
  byId('previewChallenge').textContent = preview.challenge;
  byId('previewDomains').replaceChildren(...preview.domains.map((domain) => {
    const item = document.createElement('span');
    item.textContent = titleCase(domain);
    return item;
  }));
  byId('previewOutputs').replaceChildren(...preview.recommendedOutputs.map((output) => {
    const item = document.createElement('li');
    item.textContent = titleCase(output);
    return item;
  }));
  byId('previewQuestions').replaceChildren(...preview.reviewQuestions.map((question) => {
    const item = document.createElement('li');
    item.textContent = question;
    return item;
  }));
}

byId('atlasSearch').addEventListener('input', (event) => {
  state = updateAtlasFilters(state, { query: event.currentTarget.value });
  renderDisciplines();
});

byId('domainFilter').addEventListener('change', (event) => {
  state = updateAtlasFilters(state, { domain: event.currentTarget.value });
  renderDisciplines();
});

byId('pathFrom').addEventListener('change', (event) => {
  if (!event.currentTarget.value) return;
  state = setAtlasPathEndpoint(state, 'from', event.currentTarget.value);
  renderPath();
});

byId('pathTo').addEventListener('change', (event) => {
  if (!event.currentTarget.value) return;
  state = setAtlasPathEndpoint(state, 'to', event.currentTarget.value);
  renderPath();
});

byId('createBrief').addEventListener('click', () => {
  try {
    const preview = createAtlasBriefPreview(state, byId('briefChallenge').value);
    renderBriefPreview(preview);
    byId('briefStatus').textContent = 'Preview ready for human direction. Nothing was saved or published.';
  } catch (error) {
    byId('briefStatus').textContent = error.message;
  }
});

populateControls();
renderSummary();
renderDisciplines();
renderInspector();
renderPath();
renderBriefChoices();
