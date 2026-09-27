# Maintenance map

Observed at `d382a6458`; inspect current files and release metadata each run.

| Coupled area | Source of truth and relevant behavior |
| --- | --- |
| Runtime | `.nvmrc`, `package.json#engines`, `.github/workflows/ci.yml`, README, Netlify runtime settings. Recorded repo pin was Node 22 and engines `>=22 <26`; these are historical, not upgrade targets. |
| Framework | Next Pages Router, React, `next.config.js`, `pages/**`, `next-env.d.ts`. `dev` and `build` explicitly pass `--webpack`; do not drop this incidentally. |
| Hosting | `netlify.toml` runs `npm run build`, publishes `.next`, and uses `@netlify/plugin-nextjs`. It is not a static-export-only site; `/api/pinecone-search` requires a server function. |
| Styling | Tailwind 4, `@tailwindcss/postcss`, forms/typography plugins, `css/tailwind.css`, VS Code theme tokens and static masked header logo. |
| Lint/types | ESLint flat config in `eslint.config.js`, TypeScript config, parser/plugins, Prettier. No stale `next lint` workflow. |
| Content compilation | `mdx-bundler`, esbuild binary path setup in `libs/mdx.ts`, remark/rehype plugins, `image-size` named API, `sharp`, and custom local-image transforms. |
| Generated content | `build` also runs feed and sitemap generators. `public/feed.xml`, `public/tags`, `public/sitemap.xml`, `.next`, and TypeScript build info are ignored/generated. |
| Tests | Vitest; Playwright Chromium for `scripts/crawl-sitemap.mjs`; an inline `@lhci/cli` version in `perf:lighthouse`. Browser executables must match the installed Playwright version. |
| CI | `.github/workflows/ci.yml` runs on pull requests targeting `main`, not every branch push. Verify, crawl and Lighthouse all have environment configuration. Preserve the intended PR checks when upgrading Actions. |
| Search | `nextjs-pinecone-search`, `pinecone.search.config.ts`, `pages/api/pinecone-search.ts`, `layouts/ListLayout.tsx`, `scripts/reindex-pinecone.mjs`, and production wrapper in `next.config.js`. |
| Analytics | `components/Segment.tsx`, `pages/_app.tsx`, route calls and `.env.example`. Verify graceful behavior with missing development keys and keep private service credentials server-side. |

## Search and deployment boundary

The production wrapper runs only when `NETLIFY === 'true'` and `CONTEXT === 'production'`. Ambient values can therefore turn an ordinary `npm run verify` into an indexing build. Inspect their presence without revealing other environment values, and explicitly run local checks with `NETLIFY=false CONTEXT=dev`. Local development, CI and deploy previews must not write production search indexes. Do not set production flags just to make a test resemble production. `npm run reindex` calls `reindexAll()` directly and is not guarded by that condition; use only for an authorized index refresh with the intended site/index/namespace verified.

The known config uses site URL `https://thtmnisamnstr.com`, namespace prefix `thtmnisamnstr-dotcom`, and a `blog` search sourced from `data/blog/**/*.{md,mdx}`. Check current package docs/implementation when upgrading; do not assume hooks, result shapes, filtering, or cleanup semantics remain unchanged.

At the September 2026 audit, `package.json` and the lock requested `nextjs-pinecone-search@^0.1.0`, but the npm registry no longer returned version `0.1.0`; a clean install received `E404`. Treat this as a recorded reproducibility blocker to recheck, not a permanent fact. Resolve it through a maintained published release or an intentional immutable source and verify its package contents/API. Do not substitute an unpinned repository branch merely to make installation proceed.

The environment template lists `PINECONE_API_KEY`, `PINECONE_DENSE_INDEX`, `PINECONE_SPARSE_INDEX`, Segment public keys, and Netlify CLI identifiers/tokens. Report presence/scope only; never print secret values. A missing-key build check does not establish successful production search. Source scans alone do not establish whether drafts are indexed.

The reindex script imports `@next/env`, currently available transitively through Next rather than declared directly. Audit this reliance during upgrades. The lockfile is marked `-diff` in `.gitattributes`; inspect it as JSON even when Git displays a binary-style change.

## Quality gates and limitations

`npm run verify` runs lint, typecheck, unit/integration tests, production build, feeds, and sitemap. CI then launches a server on 3012 and runs `BASE_URL=http://localhost:3012 npm run test:e2e:crawl`. Use an available port, a readiness check, and cleanup of the specific server process started for this task.

The current crawl checks browser page errors and broken/failed images. It does not assert navigation HTTP status, search interaction, redirects, canonical URLs, external links, all lazy images, or visual layout. Supplement it with targeted checks for changed behavior; do not describe it as exhaustive.

`.lighthouserc.json` takes three runs for `/`, `/blog`, and a historical image-rich article, requiring performance 0.8 and accessibility/best-practices/SEO 0.9. Keep these thresholds unless the user requests a policy change. Theme/logo performance regressions and run-to-run variation were explicitly fixed in February 2026.

The checked-in Lighthouse autorun config uploads reports to temporary public storage. For ordinary local validation, use its installed/configured CLI version and run `collect`, then `assert` separately against `.lighthouserc.json`; do not run `upload`. Equivalently, use a temporary config with upload targeting filesystem while preserving URLs, runs and assertions. Explicit authorization to publish reports or existing CI behavior can justify the original autorun command.

The image optimizer rewrites matching images throughout `public` and `src/assets`; the clean script removes `node_modules`, generated outputs and caches broadly. Read current scope and use the clean script's dry-run option before considering it during a targeted fix. Lint's existing glob excludes root configs, tests and `data`, so a passing lint result does not by itself validate every maintenance edit.

## Primary release references

- [Node release status and LTS policy](https://nodejs.org/en/about/previous-releases)
- [Next.js upgrade guides](https://nextjs.org/docs/pages/guides/upgrading)
- [Netlify build dependency/runtime configuration](https://docs.netlify.com/build/configure-builds/manage-dependencies/)
- [GitHub Actions runner setup releases](https://github.com/actions/setup-node/releases)
- [Netlify Next.js adapter releases](https://github.com/netlify/next-runtime/releases)

Use the current package registry metadata and maintainer repository/changelog for every changed package; these links are starting points, not a substitute for checking the actual target release.
