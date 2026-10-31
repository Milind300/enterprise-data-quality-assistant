# Verification handoff

## Verified in the preparation environment

- Node.js 24 parsed every `src/*.ts` file with `node --check`.
- A dependency-free smoke script exercised missing part number, vague description, category simulation, normalized cross-system duplicates, aggregation, invalid configuration and frozen input. It passed.
- This smoke check used temporary copies with `.js` import suffixes rewritten to `.ts` for the Node TypeScript runtime. It is not a substitute for the project test suite or TypeScript compilation.

## Not verified in the preparation environment

The network-restricted environment could not install npm packages. `npm test` therefore failed with `vitest: not found`; the Vitest suite, full HTTP integration tests, TypeScript compilation and package installation have not been verified. There is no lockfile because dependencies could not be resolved. On a network-connected machine, run `npm install`, `npm test`, and `npm run build` and address any failures before relying on or presenting the project as tested. Review dependency advisories and generate/commit the lockfile after installation.

## Interview walkthrough

1. Explain the sample records and why each is a candidate, not a correction.
2. Run the tests, start the service, and send `examples/items.json` as shown in README.
3. Point out how authentication, input validation, request IDs, rate limits and the mocked category advisor work.
4. Discuss limitations in SPEC.md and honestly explain what you personally reviewed and verified.
