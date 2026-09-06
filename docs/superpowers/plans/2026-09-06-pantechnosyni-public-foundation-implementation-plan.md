# PANTECHNOSYNI Public Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish PANTECHNOSYNI as an independent public synthesis product with a tested Atlas vertical slice.

**Architecture:** Canonical JSON feeds a dependency-free ESM library. A read-only CLI and fail-closed checker expose and verify deterministic behavior. GitHub Actions runs the complete local gate.

**Tech Stack:** Node.js 24, ECMAScript modules, Node test runner, JSON, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-06-pantechnosyni-public-foundation-design.md`

## Global Constraints

- No source-history import from other repositories.
- No private data, provider execution, external writes, deployment, or automatic claims.
- The repository remains public-safe and Apache-2.0 licensed.

---

### Task 1: Canonical identity and atlas data

- [x] Add `project.pantechnosyni.json` with explicit ownership and non-ownership.
- [x] Add `content/atlas/disciplines.json` with connected public-safe discipline data.
- [x] Document architecture and roadmap.

### Task 2: Atlas library and tests

- [x] Write tests for validation, search, paths, briefs, immutability, and unsafe authority changes.
- [x] Implement `src/synthesis-atlas.mjs` until focused tests pass.

### Task 3: Product interface and repository gate

- [x] Add the read-only CLI.
- [x] Add the foundation checker and package scripts.
- [x] Add read-only GitHub Actions validation.
- [x] Update README, security policy, contribution guide, and repository constitution.
