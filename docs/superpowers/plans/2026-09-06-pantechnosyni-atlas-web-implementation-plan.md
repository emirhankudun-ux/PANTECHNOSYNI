# PANTECHNOSYNI Atlas Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an accessible static web interface for the independent PANTECHNOSYNI Synthesis Atlas.

**Architecture:** A generated browser data module feeds a pure state model and semantic HTML/CSS/JS interface. Node tests enforce generator parity, state behavior, accessibility markers, responsive CSS, and no-network policy.

**Tech Stack:** Node.js 24, ESM, semantic HTML, modern CSS, vanilla JavaScript, Node test runner, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-06-pantechnosyni-atlas-web-design.md`

## Global Constraints

- No network call, browser persistence, provider execution, private-data read, external write, deployment, or automatic publication claim.
- Browser data must preserve the canonical Atlas source digest and discipline graph.
- Synthesis preview requires two to six disciplines and human direction.

---

### Task 1: Red tests and design contract

- [x] Add tests for data parity, filtering, selection, paths, brief previews, semantics, responsive layout, and reduced motion.
- [ ] Confirm hosted failure because the browser model, data, and page are absent.

### Task 2: Browser data and model

- [ ] Add deterministic browser-data generator and generated module.
- [ ] Implement pure filtering, selection, path, brief-preview, and summary behavior.

### Task 3: Product interface and verification

- [ ] Implement the Atlas HTML, CSS, and browser controller.
- [ ] Add focused checker and architecture documentation.
- [ ] Add read-only CI and verify hosted checks.
