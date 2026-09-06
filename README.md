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

## Foundation feature: Synthesis Atlas

The first working feature is a dependency-free graph of twelve disciplines across creative, product, human, technology, knowledge, science, and humanities domains.

```bash
npm run check
npm run atlas
npm run atlas:disciplines
node scripts/pantechnosyni-atlas.mjs search design
node scripts/pantechnosyni-atlas.mjs path visual-design ai-systems
node scripts/pantechnosyni-atlas.mjs brief "Design a calm public learning environment" -- visual-design human-experience knowledge-architecture
```

The atlas can search disciplines, find deterministic cross-domain paths, and create public-safe synthesis briefs. It does not execute models, call providers, mutate external systems, or publish claims automatically.

## Repository map

```text
content/atlas/              Canonical public atlas data
src/                        Dependency-free synthesis library
scripts/                    Read-only CLI and foundation validator
test/                       Node test suite
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

`v0.1.0 — public foundation`

The current repository contains a working local atlas, tests, validation, documentation, and CI. It is not a claim of live AI, autonomous execution, enterprise maturity, or production deployment.

## License

Apache License 2.0. See [LICENSE](LICENSE).
