# Blog content contract

These conventions were checked against the February 15–16, 2026 redesign and February 26 import at repository commit `d382a6458`. Inspect current code when it differs.

## File and metadata shape

Representative imports: `data/blog/20260219-pinecone-byoc.mdx`, `20251201-pinecone-dedicated-read-nodes.mdx`, and `20241202-pulumi-for-aws-automate-secure-manage.mdx`.

```mdx
---
title: 'Exact source title'
date: '2026-02-19'
tags: ['pinecone', 'product-launch']
draft: false
summary: 'A concise description of what the article explains.'
images: ['/images/blog/20260219-source-title/header.png']
authors: ['gavin-johnson']
---

**_This post was originally published on [Pinecone's blog](https://www.pinecone.io/blog/source-title/)._**

<br />

Article content starts here.
```

The example is a shape, not content to copy. A new article's filename starts with its actual publication date and a stable descriptive slug. Older filenames have exceptions such as `+`; do not rename the archive to normalize style. The February import repaired an invalid `20220332` filename to `20220401`, so calendar validation matters.

- Quote date values so YAML does not turn them into Date objects. For imported updates, keep the publication date; `lastmod` is optional and should reflect a real substantive revision.
- A source date without a time is a calendar date, not midnight UTC. At the recorded commit, `utils/date.ts` calls `new Date('YYYY-MM-DD').toLocaleDateString(...)`, which can display the previous day west of UTC, while feeds and SEO also parse the same value as an instant. Do not manufacture a time to work around this. Fix date-only handling when encountered, cover America/Los_Angeles in a regression test, and verify visible, feed, Open Graph, and JSON-LD dates retain the source day. Timestamped legacy posts must keep their established instant/offset semantics.
- `title` and `summary` are strings; `tags`, `authors`, and `images` are arrays. `draft` is a boolean, not the string `'false'`.
- `images[0]` supplies the hero in `layouts/PostSimple.tsx`; despite the permissive TypeScript type, a scalar image string is unsuitable. If the source has no usable hero, use `images: []` and mention the limitation rather than inventing one.
- Explicit `authors` is essential: `pages/blog/[...slug].tsx` otherwise falls back to `default`, but there is no `data/authors/default.mdx`.
- Omit `slug`, `fileName`, `readingTime`, and TOC metadata; these are derived from the file or MDX compiler. Posts default to `PostSimple`; do not switch layouts merely to match publisher styling.
- A draft is excluded from ordinary lists/feeds/sitemap. It is not a privacy mechanism: static blog paths and search-source behavior require separate inspection before claiming a draft is inaccessible or unindexed.

## Author records

Reuse `data/authors/<slug>.mdx` if the person already exists. Verify identities, source bylines, public bios, and portrait sources. A minimal profile follows `data/authors/aaron-kao.mdx`:

```mdx
---
name: Author Name
shortBio: A verified short public bio.
linkedin: https://www.linkedin.com/in/verified-profile/
---

A short verified biography.
```

Only include actual verified social/contact fields; the sample LinkedIn URL is not a value to reuse. `layout: AuthorLayout` and a local `avatar` are optional for a blog-only author record: current post bylines use the name and optional LinkedIn URL, and SEO uses the name. If a portrait is supplied for another real author surface, validate the local asset; never fabricate the author's appearance. Do not overwrite an existing richer biography from a short publisher byline. Author content is loaded into post metadata and SEO; there is no general `/authors/<slug>` page to invent or promise.

## Images and MDX

Local Markdown images, such as `![Diagram description](/images/blog/<slug>/diagram.png)`, are converted to the site's image component by `libs/remark-img-to-jsx.ts`, which reads actual dimensions from disk. Missing assets can bypass that conversion and only fail in the browser. Captions in mixed paragraphs and lists have historically regressed; preserve text around images and avoid trailing literal hard-break backslashes.

`components/MDXComponents.tsx` exposes `Image`, link and preformatted-code replacements, and known layouts. Keep ordinary Markdown when it expresses the article. Raw HTML needs JSX-compatible attributes and self-closing elements. `next.config.js` only allows a small set of remote image hosts, so adding arbitrary publisher hosts is not the normal import path.

Resolve article-relative links to source URLs; rewrite a link to a local article only when the same article exists here. Keep source citations and technical code intact. Do not add an original-source canonical override as an incidental import change: `components/SEO.tsx` currently emits this site's canonical URLs, while attribution links credit the publisher.

## Workbench presentation

Articles are rendered Markdown previews inside the shared workbench, not editable source. The current article and `tags/index.md` appear under the Explorer blog folder automatically; no manual Explorer or tab registration is needed. Both post layouts use a single reading column. Keep author/date/tags available in the article header; desktop Outline/post details are also derived in `LayoutWrapper`. Preserve meaningful H2/H3 headings for Outline navigation and use prose/code styles rather than adding a second metadata rail or applying monospace to the whole article. Check long titles, tables, images and code within the flexible editor at mobile/desktop widths.

## Downstream consumers

- `libs/mdx.ts`: frontmatter loading, publication filtering, date ordering, MDX compilation, reading time and image transformations.
- `pages/index.tsx`: recent blog entries are derived automatically; no manual homepage registration is needed.
- `pages/blog.tsx`, `pages/blog/page/[page].tsx`, and `pages/tags/**`: listings and pagination. Existing tag vocabulary can be read from current frontmatter or `libs/tags.ts` consumers.
- `scripts/generate-feeds.mjs` and `scripts/generate-sitemap.mjs`: generated by `corepack npm run build`. RSS content is summary-based; do not assume it reproduces every imported paragraph.
- `pinecone.search.config.ts`: reads `data/blog/**/*.{md,mdx}` under the `blog` search. In `next.config.js`, automatic indexing is gated on `NETLIFY=true` AND `CONTEXT=production`. Manual `corepack npm run reindex` bypasses that deploy gate.
- `tests/integration/mdx.test.ts`: bundles the latest post and a few historical image regressions; passing it alone does not validate every imported post. Build plus targeted browser inspection is still needed.
