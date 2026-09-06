# PANTECHNOSYNI Architecture

## Product boundary

PANTECHNOSYNI is a sovereign public product. It may describe connections to outside systems, but it does not become their runtime, memory store, research authority, or source-code owner.

## Foundation layers

1. **Canonical data** — `content/atlas/disciplines.json` defines disciplines, domains, outputs, and public-safe relationships.
2. **Synthesis library** — `src/synthesis-atlas.mjs` validates the graph and derives deterministic search, path, and brief behavior.
3. **Read-only interface** — `scripts/pantechnosyni-atlas.mjs` exposes summary, search, path, and synthesis-brief commands.
4. **Verification** — Node tests and `scripts/check-foundation.mjs` enforce identity, graph integrity, public-safety, and authority boundaries.
5. **Public surfaces** — later web and Apple-native interfaces will consume the same contracts instead of redefining them.

## Data flow

```text
public atlas JSON
      ↓ validate
canonical graph index
      ↓ derive
search · paths · synthesis briefs
      ↓ verify
unit tests · foundation checker · CI
```

## Design constraints

- no network access in the core library;
- no external writes;
- no private data;
- no automatic capability claims;
- deterministic output for identical input;
- explicit human review in every generated synthesis brief.

## Future interfaces

A public Atlas UI may add accessible graph exploration, filters, diagrams, and export. It must preserve reduced-motion, keyboard navigation, readable alternatives to graph-only views, and the same source digest used by the CLI.
