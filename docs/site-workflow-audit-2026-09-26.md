# Site workflow audit and reusable skills

Reviewed September 26, 2026, against commit `d382a6458` on `technical_updates`. Scope: repository history from February 15, 2026, current content/rendering/build/deployment code, and read-only dependency diagnostics. This is a source/process audit, not a claim that the live site or a new production build passed verification.

## September 28 workbench follow-up

This document's September 26 observations below are historical. After the workbench implementation, all four skills and their references were reviewed and updated. The current contracts cover the centralized 16-theme registry, pinned/offline generated theme CSS, shared Explorer/Outline/session tabs, sidebar resizing, native scrolling, Quick Open versus Pinecone search, and the Playwright/axe release gate. Lighthouse now covers five routes, including About and Resume. Resume metadata uses paragraphs and skills use a responsive list instead of h5 metadata and an empty-header table. Generated Next environment/types are ignored and recreated before typechecking. The README screenshot is maintained under `docs/images`.

The [workbench alignment report](./vscode-workbench-alignment.md) records the implementation and its verification. The older package, search-error, test-coverage and layout findings here must not be read as the current implementation state; recheck current sources before acting on them.

## Skills created

Four repository-local skills live under `.agents/skills/`, the OpenAI-compatible location for reusable project workflows. Each has `SKILL.md`, a task-specific reference, and `agents/openai.yaml` for discovery. Because they are versioned with the site, other contributors and coding agents receive the same workflow instead of depending on one machine's personal Codex configuration.

| Invocation                                                   | What it handles                                                                                                                                                                                            |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$update-blogs` followed by article links                    | Complete source imports, duplicate detection, publication dates, MDX, provenance, coauthors, local images, tags, generated outputs and verification. Includes a read-only metadata/author/image validator. |
| `$update-resume` followed by a Google Doc or Markdown resume | Full replacement or partial update, source fidelity, site heading/layout conventions, preserved evidence links, and reporting of duplicated current-role/contact drift.                                    |
| `$update-site`                                               | Current dependency and tooling discovery, supported Node/npm selection, coordinated upgrades and migrations, lockfile reproducibility, advisories and release checks.                                      |
| `$verify-site`                                               | Independent site QA and release diagnosis across builds, routes, images, themes, mobile layouts, search, Lighthouse and deployment/indexing evidence.                                                      |

The skill-creator workflow informed the narrow descriptions, supporting references, automatic discoverability, and validation. The skills query current release information on each future maintenance run; they do not hardcode September's package targets. The default Node choice is the latest suitable supported LTS release, consistent with the [Node project's production guidance](https://nodejs.org/en/about/previous-releases). Explicit user preferences can override that choice where the hosting/dependency stack supports them.

These skills prepare and validate work within the user's requested scope. Existing authorization to commit/push/deploy is honored; an ordinary import or check does not by itself authorize production deployment or a manual search-index write.

## What changed since the redesign

| Date / evidence                                               | Process or architecture change                                                                                                            | Captured in the skills                                                                                            |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Feb 15: `b19202877`, `e63acce5d`                              | VS Code-inspired redesign, content/layout changes, dependency/runtime cleanup, PR checks, crawler, Lighthouse, image optimizer and tests. | Preserve the current framework/layout; update runtime/config together; use the existing quality gates.            |
| Feb 16: `63ae81e3b`                                           | Pagination, theme persistence, image lightbox, mixed image/caption handling, feed/sitemap and build/deploy hardening.                     | Check interactions and generated outputs, not only compilation; keep image captions and stable routes.            |
| Feb 16: `6e16acfc5`                                           | Resume restructure, theme/layout polish and configuration cleanup.                                                                        | Preserve resume role grouping and established heading/style conventions.                                          |
| Feb 16: `5c1d7f38d`, `bfcb1d92f`                              | Static masked header logo improved performance; Lighthouse increased to three runs to reduce flakiness.                                   | Preserve performance behavior, configured repetitions and thresholds.                                             |
| Feb 26: `25ce8ef0d`                                           | Five blog imports, four new coauthor profiles, local media, attribution/tag normalization, date/slug repair, resume link restoration.     | Treat each import as content plus authors/assets; preserve evidence links; validate real dates and existing URLs. |
| Mar 30–31: `752c255fa`, `bb14e6c6d`, `811db2caf`, `a765d4709` | Pinecone-backed search, deployment/CI environment changes, production-only automatic indexing and manual reindex command.                 | Distinguish local verification, deployment success and fresh search indexes; preserve the production gate.        |

The three merged work streams are PR #93 (redesign), #94 (content), and #95 (technical/search). The checked-out history contains no later source changes after March 31. Use an explicit history boundary such as `2026-02-15T00:00:00-08:00` to include the first day's commits reliably.

## Findings that should influence future work

### Maintenance is due

The installed local runtime was Node `26.10.0` / npm `11.19.1`. The repository still declares Node `>=22 <26`, while `.nvmrc` and CI select Node 22. Local runs with the current shell therefore do not represent the declared supported environment. Runtime selection must be reconciled across [package.json](../package.json), [.nvmrc](../.nvmrc), [CI](../.github/workflows/ci.yml), README and actual Netlify settings.

Read-only npm diagnostics found **25 outdated direct dependencies** and **19 audit package findings**: 2 critical, 12 high, 4 moderate and 1 low. These are registry/lockfile observations, not proof that each issue is exploitable in production. Audit-time examples included Next `16.1.6` versus latest `16.3.6`, React/React DOM `19.2.4` versus `19.3.0`, TypeScript `5.9.3` versus `7.0.2`, and Vitest `4.0.18` versus `5.0.2`. Re-query before acting; these versions will age.

The installed dependency tree is also stale: `nextjs-pinecone-search` is missing locally, the installed Netlify adapter is `5.15.8` while the manifest/lock resolve `5.15.9`, and `@emnapi/runtime` is extraneous. The lock points at the registry tarball for `nextjs-pinecone-search@0.1.0` and also retains an extraneous `../nextjs-pinecone-search` metadata entry. A direct registry query on September 27 returned `E404` for that version, so the current lock cannot support a reproducible clean install until the dependency is moved to a maintained published release or intentional immutable source. A transient working `node_modules` directory is not an acceptable substitute. Recheck the registry when addressing this because availability can change.

The audit tool also proposed a downgrade of `mdx-bundler` to `5.1.1`; blindly applying audit fixes would be inappropriate without evaluating the MDX pipeline. A temporary experiment that replaced the missing Pinecone package from its repository exposed a formatting failure after dependency resolution changed, while the current installed Prettier reports `types/mdx.ts` as formatted. That experiment is evidence to retest the full toolchain after resolving the package source, not evidence of a current source-format defect.

Also inspect the inline Lighthouse CLI pin, Actions versions, Playwright browser binaries, Netlify adapter and the reindex script's undeclared direct use of transitive `@next/env`. `.gitattributes` suppresses normal lockfile diffs, so inspect its JSON directly when assessing a change.

### Blog imports have an implicit contract

There are 59 blog MDX files and 27 tag values. Current posts use explicit authors, arrays for images, local media and an original-publisher attribution line. [PostSimple](../layouts/PostSimple.tsx) reads `images[0]` despite the type allowing strings; the blog route's fallback author is `default`, but there is no corresponding author file. These are concrete reasons to validate metadata and author records. Current bylines render author names and optional LinkedIn links, while SEO uses names; portraits are optional unless another current surface needs one.

Source imports also need code, captions, citations, publisher-relative links and coauthor bios. Build output automatically refreshes homepage/list inputs, RSS, sitemap and tag pages; no manual post registry is needed. The image optimizer scans broadly and may rewrite unrelated assets, so a small import should keep optimization scoped.

The new helper validates explicit post paths, frontmatter shapes, real calendar dates, date/filename agreement, author records, optional supplied portraits, and frontmatter image dimensions. It deliberately does not claim to validate article fidelity, all inline images, MDX execution or rendered layout; those still require source comparison, build and browser checks.

Date-only imports expose a current rendering gap: [utils/date.ts](../utils/date.ts) passes bare `YYYY-MM-DD` strings to `new Date()` and then formats them in the local timezone. JavaScript treats the input as midnight UTC, so `2026-02-19` displays as February 18 in America/Los_Angeles. Feeds and article SEO also parse dates as instants. The blog skill now requires a date-only regression check and a shared parsing fix when this case is encountered, while preserving real timestamps instead of inventing an arbitrary time.

### Resume facts can drift between files

[resume.mdx](../data/authors/resume.mdx) is the canonical resume body. Its `shortBio` still refers to Earthly, while its body, [Gavin's author profile](../data/authors/gavin-johnson.mdx) and [homepage](../pages/index.tsx) refer to Pinecone. Shared contact details also live in [siteMetadata.ts](../data/siteMetadata.ts).

The Feb 16 rewrite lost evidence links restored on Feb 26. A reliable update should compare the supplied source section by section, preserve verified links on unchanged passages, retain multiple roles under one employer, reconcile resume metadata, and report contradictory facts on other surfaces. Those other surfaces change only when the request includes site-wide synchronization. No current career facts should be invented from these historical observations.

### Build and CI success do not establish complete user-facing correctness

The seven existing tests cover file utilities and selected blog MDX cases. There are no dedicated resume or search interaction tests. The [sitemap crawler](../scripts/crawl-sitemap.mjs) checks page errors and image failures but ignores the navigation response's HTTP status; a 404/500 without those errors can pass. It does not exercise search, themes, mobile menus or lightboxes, and may miss lazy images not scrolled into view.

The [search UI](../layouts/ListLayout.tsx) maps backend errors to an empty array and can display “No posts found.” A test must inspect the response to distinguish a provider error from a valid empty result. There is currently no separate keyword-search mode or automatic keyword fallback.

The existing lint glob omits root config files, tests and content. Lighthouse samples home, the blog index and one older article, not the resume. Its autorun configuration uploads to temporary public storage; local skill-driven checks should collect/assert without publishing reports unless that is authorized.

### Production indexing is a distinct stage

[next.config.js](../next.config.js) only activates the Pinecone build wrapper for `NETLIFY=true` and `CONTEXT=production`. Ambient values can therefore make an ordinary local build perform an external indexing write. The skills now require explicit safe local overrides (`NETLIFY=false CONTEXT=dev`) before verification. [The manual reindex script](../scripts/reindex-pinecone.mjs) directly writes the index without that gate. Preserve this March 31 separation during upgrades and content work.

PR checks run only on pull requests targeting `main`; branch pushes alone do not establish that they ran. Ordinary PR/local builds also do not exercise production indexing. A completed local import, successful deployment and fresh search index must be reported separately. No Netlify dashboard settings, live provider credentials or successful production indexing were verified during this audit.

`draft: true` is a publication filter for ordinary lists/feeds/sitemap, not a proven privacy boundary: the catch-all route and external search scanner must also be examined before asserting that draft content cannot be accessed or indexed.

## Why exactly one additional skill

`verify-site` addresses a recurring cross-cutting workflow demonstrated by the redesign's repeated rendering/performance fixes and the later production-only search behavior. It can be invoked independently after content, package or interface changes. Separate search, image, theme, deployment and author-bio skills would currently duplicate these workflows without adding a clear recurring capability.

## Delivery and validation scope

The requested deliverable is reusable repository skills plus this audit. Site packages, career content, CI settings and production services were not updated as part of skill creation. Skill metadata/frontmatter, reference paths and the blog validator are checked separately from application tests; a full site upgrade and release verification remain future uses of the new skills.
