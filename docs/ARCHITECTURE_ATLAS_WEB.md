# PANTECHNOSYNI Atlas Web Architecture

## Purpose

Atlas Web turns the tested public Synthesis Atlas into a readable, interactive product surface. It supports exploration and human-directed synthesis without adding live AI, storage, private data, or external-write authority.

## Data flow

```text
content/atlas/disciplines.json
        ↓ buildSynthesisAtlas()
canonical deterministic graph
        ↓ build-atlas-web-data
apps/web/atlas-data.js
        ↓ pure browser state model
search · filter · inspect · path · synthesis preview
        ↓ human direction
review, revise, or discard in the current session
```

`node scripts/build-atlas-web-data.mjs --check` prevents the committed browser module from drifting from the canonical graph or source digest.

## Interaction model

- Search covers discipline names, domains, descriptions, and outputs.
- Domain filtering has a readable select and count inventory.
- Discipline selection updates a textual inspector with outputs and connections.
- Path controls calculate the same deterministic shortest route as the Node Atlas.
- Synthesis selection is limited to two through six disciplines.
- Brief previews expose recommended outputs and human review questions.
- No interaction saves, publishes, deploys, invokes a provider, or writes externally.

## Accessibility

The interface includes semantic landmarks, a skip link, native controls, visible focus, live result status, readable text alternatives to graph relationships, responsive reading order, and reduced-motion handling. These static and unit checks are not a WCAG certification; browser and assistive-technology review remain separate evidence.

## Run

```bash
python3 -m http.server 4173 --bind 127.0.0.1 --directory apps/web
```

Open `/index.html`.

## Verify

```bash
npm run check:web-data
node --test test/atlas-web.test.mjs
npm run check:atlas-web
npm run check
```
