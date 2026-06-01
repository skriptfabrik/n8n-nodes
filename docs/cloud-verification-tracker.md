# n8n Cloud Verification Tracker

This tracker documents implementation progress for making all packages in this monorepo available to both self-hosted n8n and n8n Cloud users.

## Goal

All published packages should pass n8n cloud verification checks:

- npm provenance available on published npm versions
- no runtime dependencies in verified packages
- package metadata and docs aligned with verification guidelines
- package passes @n8n/scan-community-package

## Current Scanner Snapshot (2026-06-01)

Source command:

pnpm cloud:verify

Latest observed status by published package version:

| Workspace package    | npm package                                  | Result | Primary blocker                          |
| -------------------- | -------------------------------------------- | ------ | ---------------------------------------- |
| barcode              | @skriptfabrik/n8n-nodes-barcode              | Fail   | Runtime dependencies (canvas, jsbarcode) |
| channable            | @skriptfabrik/n8n-nodes-channable            | Pass   | None                                     |
| clockify-enhanced    | @skriptfabrik/n8n-nodes-clockify-enhanced    | Fail   | Missing npm provenance on latest release |
| cronhooks            | @skriptfabrik/n8n-nodes-cronhooks            | Pass   | None                                     |
| fulfillmenttools     | @skriptfabrik/n8n-nodes-fulfillmenttools     | Pass   | None                                     |
| google-enhanced      | @skriptfabrik/n8n-nodes-google-enhanced      | Fail   | Missing npm provenance on latest release |
| headwind-mdm         | @skriptfabrik/n8n-nodes-headwind-mdm         | Fail   | Missing npm provenance on latest release |
| kaufland-marketplace | @skriptfabrik/n8n-nodes-kaufland-marketplace | Pass   | None                                     |
| moco                 | @skriptfabrik/n8n-nodes-moco                 | Pass   | None                                     |
| otto-market          | @skriptfabrik/n8n-nodes-otto-market          | Pass   | None                                     |
| sentry-io-enhanced   | @skriptfabrik/n8n-nodes-sentry-io-enhanced   | Fail   | Missing npm provenance on latest release |

## Implementation Progress

### Completed

- Added cloud readiness verification script:
  - tools/scripts/verify-cloud-readiness.mjs
- Added root scripts:
  - pnpm cloud:verify
  - pnpm cloud:verify:package <workspace-package>
- Updated publish workflow:
  - Added workflow_dispatch input verify-cloud-readiness (default true)
  - Enforced NPM_CONFIG_PROVENANCE=true during release
  - Added post-release scanner verification step with retries

### Next Work Items

1. Provenance refresh releases

- Publish new versions for packages currently failing only due missing provenance:
  - clockify-enhanced
  - headwind-mdm
  - sentry-io-enhanced

2. Runtime dependency remediation

- Refactor barcode package to remove runtime dependencies or replace implementation with dependency-free approach.
- Refactor google-enhanced package to remove runtime dependencies.

3. Submission readiness checks

- Validate package metadata alignment per package:
  - repository, author/maintainer consistency, MIT license, README completeness
- Validate one-service-per-package constraints and UX/docs completeness before Creator Portal submission.

4. Creator Portal submissions

- Submit all passing packages in batches.
- Track review outcomes and required changes.

## Operational Commands

- Verify all packages from latest npm releases:

pnpm cloud:verify

- Verify one workspace package from latest npm release:

pnpm cloud:verify:package channable

- Publish one package via workflow with verification enabled:

Use workflow .github/workflows/publish-package.yaml and keep verify-cloud-readiness set to true.
