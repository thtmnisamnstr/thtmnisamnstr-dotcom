---
name: verify-site
description: Check thtmnisamnstr.com for release readiness or regressions using its build, runtime crawl, Lighthouse, content, theme and Pinecone-search checks. Use for this site's QA or deployment diagnosis; a verification request does not itself request code changes or deployment.
---

# Verify site

Verify the actual changed site or diagnose a reported failure in `thtmnisamnstr/thtmnisamnstr-dotcom`. Prefer its active checkout; the usual location is `/Users/gavinjohnson/Documents/Development/thtmnisamnstr-dotcom`. Record branch/commit, short worktree status, lockfile identity, and selected Node/npm versions so results describe a concrete tree. Reuse earlier evidence only when those inputs and the relevant generated build are unchanged.

Determine whether the request is inspection, a fix, or release work. A check/review reports findings; a request to fix authorizes relevant repairs and re-verification. Reuse checks already completed for the same source, dependency lock, and runtime. Honor existing publishing authorization, but do not infer it from a check request.

Read [references/verification-checklist.md](references/verification-checklist.md), selecting the checks relevant to the change. Default release verification includes build, runtime crawl, performance checks, representative visual pages and search behavior. A narrow content check can concentrate on affected pages plus the build.

## Establish and run the checks

- Inspect the current Node pin/engines, lockfile, package scripts, `netlify.toml`, CI, and `next.config.js`. Use the supported runtime and a matching installation. If inspection requires restoring dependencies, avoid disturbing another active task; use an isolated checkout where appropriate.
- Inspect ambient `NETLIFY` and `CONTEXT` without printing secrets. For local verification, run `env NETLIFY=false CONTEXT=dev npm run verify`; a successful build generates the feeds/sitemap used by later checks without activating the production-only Pinecone wrapper. Use a genuine production build only when production indexing is authorized and intended. Do not continue with stale output after a failed build and call it a pass.
- Serve the production build on an available local port, wait for readiness, and run `BASE_URL=http://localhost:<port> npm run test:e2e:crawl`. Install the matching Playwright Chromium browser if needed. Use cleanup that targets only the server started for this check, including when a later assertion fails, and confirm no check-owned server remains afterward.
- Inspect response status and meaningful page content on representative routes as well as browser errors and images. The existing crawler alone does not validate status codes or user interactions. Prefer DOM assertions for title/metadata, or attribute-tolerant HTML matching: framework output may add attributes to tags such as `<title>` without changing the rendered metadata.
- Run configured Lighthouse collection/assertions when doing release/performance/shared-layout verification. Preserve the configured three runs and thresholds. Use local reports: the existing `perf:lighthouse` autorun uploads to temporary public storage, so run equivalent `collect` and `assert` steps without `upload`, or use a temporary filesystem-upload config unless report publication is authorized.
- Inspect relevant desktop/mobile pages, theme selection/persistence, and changed user interactions. Capture mobile menus at viewport size rather than with a full-page screenshot, because fixed overlays can create misleading stitched output. For a reported production issue, compare local evidence with available read-only CI/Netlify/deployed-site evidence. Never claim an unseen deployment passed.

## Search and external-state checks

Validate search request handling, result links, and failure/empty/loading behavior as described in the checklist. Use available configured credentials for a bounded functional check without exposing values; if unavailable, test local contract/error behavior and mark successful backend search unverified. The recorded UI has one Pinecone-backed search, not a separate keyword mode.

Automatic indexing is intentionally restricted to Netlify production deployments. Local/preview verification must not masquerade as production or call `npm run reindex`. For an authorized deployment or explicit reindex task, verify target site/index/namespace, inspect the real indexing result, and then check a newly published article in search. Do not repeatedly reindex an unexplained failure; diagnose it first.

## Report or repair

Give an overall result of passed, failed, or partial, backed by checks and the tested tree/runtime. Separate pre-existing failures, new regressions, and unavailable external checks. For failures, state the affected behavior, evidence/file location, and practical next step; do not merely list tool errors.

When repairs are requested, fix within that scope and rerun the affected gates. Never lower thresholds, skip failing routes, suppress relevant errors, or change production credentials to make verification green. Report production release/index status separately from local verification.
