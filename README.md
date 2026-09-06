# ΠΑΝΤΕΧΝΟΣΥΝΗ — PANTECHNOSYNI

**Unified Creative Intelligence Ecosystem**

PANTECHNOSYNI is an independent, public interdisciplinary synthesis system. It connects creative practice, technology, science, knowledge, and human experience through inspectable tools rather than vague “everything platform” claims.

## What it owns

- the PANTECHNOSYNI Synthesis Atlas;
- public cross-domain synthesis workflows;
- a shared design language for explaining relationships between disciplines;
- open examples that turn a challenge into a human-reviewed synthesis brief.

## What it does not own

PANTECHNOSYNI does not absorb external product runtimes, private creative memory, separate research programs, or another repository’s source history. Interoperability may be added later through explicit public contracts; ownership stays with each independent project.

## Synthesis Atlas

The foundation now includes both a dependency-free graph library and an accessible static web surface for twelve disciplines across creative, product, human, technology, knowledge, science, and humanities domains.

### Command line

```bash
npm run check
npm run atlas
npm run atlas:disciplines
node scripts/pantechnosyni-atlas.mjs search design
node scripts/pantechnosyni-atlas.mjs path visual-design ai-systems
node scripts/pantechnosyni-atlas.mjs brief "Design a calm public learning environment" -- visual-design human-experience knowledge-architecture
```

### Web Atlas

```bash
python3 -m http.server 4173 --bind 127.0.0.1 --directory apps/web
```

Open `/index.html` to search and filter disciplines, inspect connections, trace paths, and create a session-only synthesis preview. The interface performs no network calls and stores nothing in the browser.

## Repository map

```text
content/atlas/              Canonical public atlas data
src/                        Dependency-free synthesis library
apps/web/                   Accessible static Atlas product surface
scripts/                    Build adapters, read-only CLIs, and validators
test/                       Node behavior and static-surface tests
docs/                       Architecture and roadmap
.github/workflows/          Read-only CI
```

## Development principles

- Human direction remains final.
- Evidence comes before capability claims.
- Public-safe data only.
- Small, testable, reversible changes.
- Accessibility and cultural context are design requirements.
- No blind import from other repositories.

## Status

`v0.2.0 — interactive public foundation`

The repository contains a working local Atlas, interactive static web surface, tests, validation, documentation, and CI. It is not a claim of live AI, autonomous execution, enterprise maturity, production deployment, or accessibility certification.

## License

Apache License 2.0. See [LICENSE](LICENSE).
