# Specification and engineering decisions

## Purpose and boundary
Input records are transient. POST accepts an array and returns candidate findings, never writes to a source system, and never mutates caller-owned data. Express/JSON transport -> Zod parser (creates normalized copies) -> review service -> four independent rules -> JSON findings. There is no database in this slice: avoiding a speculative repository or persistence layer prevents unintended writes and reduces scope. A human can use the output for a later review workflow; approve/reject persistence is not implemented.

## Checks (exactly four)
1. **Missing part number**: manufacturer present, part number absent after trimming. Deterministic; confidence 1 represents rule certainty, not proof of data quality.
2. **Weak description**: missing, fewer than three whitespace-separated words, or fewer than 12 characters. This is an intentionally simple heuristic, likely to misclassify short valid descriptions and non-English text.
3. **Possible duplicate**: both manufacturer and manufacturer part number present; normalize Unicode NFKC, lowercase, and remove punctuation and spaces; match the two fields across differently named source systems. Only candidates, never merge. No fuzzy description matching; normalization can produce false positives. Different rows in the same system are not flagged by this rule. Duplicate item IDs are accepted; item ID plus source system may still be non-unique. A real workflow needs a unique ingest row ID before review decisions can be tracked.
4. **Category mismatch**: `CategoryAdvisor` is an injectable async service boundary. The local simulator recognizes bearing/valve in an Electrical category and proposes Mechanical. It is deterministic demo logic, not an LLM, and does not generalize. Invalid simulated output causes a safe request failure, not an automatic decision.

Severity and confidence values are explicitly illustrative and uncalibrated; they should not be treated as empirical probabilities. Each finding has an explanation, source, identity, action and review status.

## Input and security assumptions
Only `item_id` and `source_system` are mandatory; the remaining fields may be missing or null. Invalid rows reject the entire batch rather than silently dropping rows. Empty arrays and unknown keys are rejected. Up to 500 items and 256 KB per request; input JSON only. No uploaded files are retained.

A shared Bearer secret from the environment protects the endpoint with constant-time equal-length comparison. This is an assessment authentication and coarse authorization baseline, not per-user identity, roles, revocation, or audit. Use TLS, an identity provider and scoped authorization in production. CORS is an exact origin allowlist, not authentication; requests without Origin can be legitimate API clients. The local in-memory IP limiter bounds entries and applies before authentication, but is per process, resets on restart, and is not a substitute for gateway/distributed rate limits. `trust proxy` is disabled; configure trusted proxies carefully when deployed behind one. Logs omit payloads, tokens, and exceptions to reduce disclosure; a request correlation ID is generated server-side. Logs are not an audit trail. The service is not production-certified.

## Safe future LLM integration
Replace the simulator through `CategoryAdvisor` only after obtaining data classification, owner approval and contractual privacy controls. Send only the minimum allowed, sanitized description and category; omit IDs, credentials and personal or confidential data where possible. Treat input as untrusted, use a fixed prompt and no tools or write permissions. Strictly validate structured model output, category against a managed taxonomy, confidence bounds, length and references; apply timeouts, bounded retries and circuit breakers, and handle failure without approving data. Present the model, version, evidence, caveats and review status. Protect logs, define retention, evaluate on representative human-labeled examples, track false positives and drift, and record reviewer decisions in an access-controlled audit system. Never interpret model confidence as calibrated without evaluation. This slice only checks nonempty outputs and numeric range; it has no production model client or taxonomy validator.

## Tradeoffs and next steps
Prioritized understandable rules, bounded input and tests over UI, database, CSV, distributed infrastructure, calibration and a complete reviewer workflow. No automatic updates, persistence, database, real AI call, monitoring backend or user-role management is included. Add reviewer decisions and audit history, row-level identities, robust fuzzy duplicate evaluation, authorization, rate limiting at the gateway, dependency scanning, CI and deployment hardening next.

## Interview narrative
- Plan: clarify data, boundaries, rules, output and limits before coding.
- AI delegation: describe honestly which parts were generated with an assistant; the candidate should review the actual output and avoid claiming manual verification that did not happen.
- Personal verification: run the exact sample, build and tests; inspect the four rules and auth failure paths; demonstrate that input is unchanged and review output is explainable.
- Discuss risks: shared token, heuristic false positives, uncalibrated confidence, untrusted LLM output, no audit store, and in-memory rate limit across instances.
