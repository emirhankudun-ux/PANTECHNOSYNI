// Generated from content/atlas/disciplines.json. Do not edit by hand.
export const atlasWebData = {
  "schemaVersion": 1,
  "contractId": "pantechnosyni-synthesis-atlas-v1",
  "sourceDigest": "sha256:25bf835a1461110e95ede11e4d0732ebc010c290e3814f24e8c740faa822fdd1",
  "identity": {
    "displayName": "PANTECHNOSYNI",
    "greekName": "ΠΑΝΤΕΧΝΟΣΥΝΗ",
    "tagline": "Unified Creative Intelligence Ecosystem",
    "mode": "public-foundation"
  },
  "principles": [
    "human-authored-direction",
    "cross-domain-clarity",
    "evidence-before-claims",
    "public-safe-by-default",
    "accessible-and-portable"
  ],
  "summary": {
    "disciplineCount": 12,
    "domainCount": 8,
    "connectionCount": 25,
    "connectedDisciplineCount": 12
  },
  "domainCounts": {
    "creative": 2,
    "creative-technology": 1,
    "human": 1,
    "humanities": 1,
    "knowledge": 2,
    "product": 1,
    "science": 2,
    "technology": 2
  },
  "disciplines": [
    {
      "id": "ai-systems",
      "label": "AI Systems",
      "domain": "technology",
      "description": "Model orchestration, evaluation, tool boundaries, and human supervision.",
      "outputs": [
        "ai-capability-map",
        "evaluation-plan",
        "human-approval-gate"
      ],
      "connectsTo": [
        "software-engineering",
        "mathematics",
        "knowledge-architecture",
        "human-experience"
      ],
      "connections": [
        "human-experience",
        "knowledge-architecture",
        "mathematics",
        "software-engineering",
        "systems-thinking"
      ],
      "connectionCount": 5
    },
    {
      "id": "cultural-research",
      "label": "Cultural Research",
      "domain": "humanities",
      "description": "Context, symbolism, language, history, and responsible interpretation.",
      "outputs": [
        "cultural-context",
        "narrative-guardrail",
        "symbol-system"
      ],
      "connectsTo": [
        "human-experience",
        "knowledge-architecture",
        "visual-design"
      ],
      "connections": [
        "human-experience",
        "knowledge-architecture",
        "visual-design"
      ],
      "connectionCount": 3
    },
    {
      "id": "human-experience",
      "label": "Human Experience",
      "domain": "human",
      "description": "Usability, accessibility, emotion, trust, and inclusive interaction.",
      "outputs": [
        "accessibility-contract",
        "experience-principles",
        "research-question"
      ],
      "connectsTo": [
        "visual-design",
        "motion-design",
        "product-strategy",
        "cultural-research"
      ],
      "connections": [
        "ai-systems",
        "cultural-research",
        "motion-design",
        "product-strategy",
        "visual-design"
      ],
      "connectionCount": 5
    },
    {
      "id": "knowledge-architecture",
      "label": "Knowledge Architecture",
      "domain": "knowledge",
      "description": "Taxonomy, provenance, retrieval, synthesis, and durable decision memory.",
      "outputs": [
        "decision-record",
        "knowledge-map",
        "provenance-model"
      ],
      "connectsTo": [
        "product-strategy",
        "software-engineering",
        "ai-systems",
        "cultural-research"
      ],
      "connections": [
        "ai-systems",
        "cultural-research",
        "product-strategy",
        "scientific-modeling",
        "software-engineering",
        "systems-thinking"
      ],
      "connectionCount": 6
    },
    {
      "id": "mathematics",
      "label": "Mathematics",
      "domain": "science",
      "description": "Formal reasoning, structure, optimization, uncertainty, and measurement.",
      "outputs": [
        "formal-model",
        "metric-system",
        "uncertainty-model"
      ],
      "connectsTo": [
        "ai-systems",
        "scientific-modeling",
        "software-engineering"
      ],
      "connections": [
        "ai-systems",
        "scientific-modeling",
        "software-engineering"
      ],
      "connectionCount": 3
    },
    {
      "id": "motion-design",
      "label": "Motion Design",
      "domain": "creative",
      "description": "Time, rhythm, transition, and expressive interface behavior.",
      "outputs": [
        "interaction-sequence",
        "motion-language",
        "narrative-rhythm"
      ],
      "connectsTo": [
        "visual-design",
        "three-dimensional-design",
        "human-experience"
      ],
      "connections": [
        "human-experience",
        "three-dimensional-design",
        "visual-design"
      ],
      "connectionCount": 3
    },
    {
      "id": "product-strategy",
      "label": "Product Strategy",
      "domain": "product",
      "description": "Purpose, audience, prioritization, value, and delivery framing.",
      "outputs": [
        "decision-framework",
        "delivery-roadmap",
        "product-thesis"
      ],
      "connectsTo": [
        "visual-design",
        "human-experience",
        "software-engineering",
        "knowledge-architecture"
      ],
      "connections": [
        "human-experience",
        "knowledge-architecture",
        "software-engineering",
        "systems-thinking",
        "visual-design"
      ],
      "connectionCount": 5
    },
    {
      "id": "scientific-modeling",
      "label": "Scientific Modeling",
      "domain": "science",
      "description": "Hypotheses, observations, reproducible models, and evidence-aware explanation.",
      "outputs": [
        "evidence-summary",
        "experiment-design",
        "hypothesis-map"
      ],
      "connectsTo": [
        "mathematics",
        "three-dimensional-design",
        "knowledge-architecture"
      ],
      "connections": [
        "knowledge-architecture",
        "mathematics",
        "systems-thinking",
        "three-dimensional-design"
      ],
      "connectionCount": 4
    },
    {
      "id": "software-engineering",
      "label": "Software Engineering",
      "domain": "technology",
      "description": "Modular architecture, reliable implementation, testing, and delivery systems.",
      "outputs": [
        "interface-contract",
        "software-architecture",
        "verification-plan"
      ],
      "connectsTo": [
        "product-strategy",
        "three-dimensional-design",
        "ai-systems",
        "knowledge-architecture"
      ],
      "connections": [
        "ai-systems",
        "knowledge-architecture",
        "mathematics",
        "product-strategy",
        "three-dimensional-design"
      ],
      "connectionCount": 5
    },
    {
      "id": "systems-thinking",
      "label": "Systems Thinking",
      "domain": "knowledge",
      "description": "Relationships, feedback loops, boundaries, risks, and long-horizon effects.",
      "outputs": [
        "feedback-model",
        "risk-register",
        "system-map"
      ],
      "connectsTo": [
        "product-strategy",
        "knowledge-architecture",
        "scientific-modeling",
        "ai-systems"
      ],
      "connections": [
        "ai-systems",
        "knowledge-architecture",
        "product-strategy",
        "scientific-modeling"
      ],
      "connectionCount": 4
    },
    {
      "id": "three-dimensional-design",
      "label": "3D Design",
      "domain": "creative-technology",
      "description": "Spatial form, materials, lighting, environments, and simulation-ready assets.",
      "outputs": [
        "environment-concept",
        "material-study",
        "spatial-system"
      ],
      "connectsTo": [
        "motion-design",
        "software-engineering",
        "scientific-modeling"
      ],
      "connections": [
        "motion-design",
        "scientific-modeling",
        "software-engineering"
      ],
      "connectionCount": 3
    },
    {
      "id": "visual-design",
      "label": "Visual Design",
      "domain": "creative",
      "description": "Identity, typography, composition, color, and visual systems.",
      "outputs": [
        "editorial-system",
        "identity-system",
        "visual-language"
      ],
      "connectsTo": [
        "motion-design",
        "product-strategy",
        "human-experience"
      ],
      "connections": [
        "cultural-research",
        "human-experience",
        "motion-design",
        "product-strategy"
      ],
      "connectionCount": 4
    }
  ],
  "policy": {
    "runtimeExecution": false,
    "externalWrites": false,
    "privateData": false,
    "automaticClaims": false
  }
};
