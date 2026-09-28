# Resume rendering contract

Updated for the September 28, 2026 workbench revision; prefer current source if it changes.

| Responsibility                           | File                                                                                      |
| ---------------------------------------- | ----------------------------------------------------------------------------------------- |
| Resume content and frontmatter           | `data/authors/resume.mdx`                                                                 |
| `/resume` static props and analytics     | `pages/resume.tsx`                                                                        |
| Page title, SEO and prose container      | `layouts/ResumeLayout.tsx`                                                                |
| MDX compilation and component mapping    | `libs/mdx.ts`, `components/MDXComponents.tsx`                                             |
| Typography, skills grid and theme styles | `css/tailwind.css`, `css/workbench.css`, generated `css/themes.css`, `tailwind.config.js` |
| Author profile/current-role facts        | `data/authors/gavin-johnson.mdx`                                                          |
| Homepage current-role sentence           | `pages/index.tsx`                                                                         |
| Shared public contact/social details     | `data/siteMetadata.ts`                                                                    |

`pages/resume.tsx` calls `getFileBySlug('authors', 'resume')`; it does not read JSON, a public PDF, or the Google Doc at runtime. Update the local MDX. The existing layout supplies the `Resume` h1 and generic SEO description, and wraps the body in `vscode-body-copy prose prose-lg dark:prose-dark`. Frontmatter social fields are not automatically rendered as a contact header by this layout, so a source contact row intended to be visible must appear in the body as well.

The established hierarchy is:

```md
## Gavin Johnson

Source summary and skills.

## Experience

### Employer

**Location (Remote)**

#### Role title

_Month YYYY–Month YYYY_

Source role summary.

- Source accomplishment.

#### Another role at the same employer

_Month YYYY–Month YYYY_

- Its own accomplishment.

## Education
```

Locations are bold paragraphs and dates are italic paragraphs; job titles use h4, employers h3, and section labels h2. The September workbench review removed h5 metadata headings to keep accessible heading navigation meaningful. This is an existing styling convention, not permission to invent missing location/date information. Retain separate roles at the same employer rather than merging their accomplishments or dates. Dates and punctuation may be normalized without changing their meaning. Check actual CSS before changing levels to solve a visual issue.

The current skills introduction uses `<ul className="vscode-resume-skills">` with ordinary list items. CSS makes it two columns on desktop and one on mobile; this replaced a table with empty headers. Preserve those semantics or equivalent accessible source-appropriate lists. Google Docs tables can arrive as tab-separated text; inspect row/column meaning rather than copying text order blindly. Do not restore empty-header layout tables.

The shared shell gives `/resume` a document tab, breadcrumbs and a heading Outline automatically. Keep the resume inside its reading column and avoid another sidebar. Use semantic theme tokens for renderer styling; ordinary factual updates do not require changes to the centralized theme registry or generated CSS.

The redesign's February 16 commit `6e16acfc5` significantly restructured the resume's body and heading levels. The February 26 content import restored evidence hyperlinks lost during that rewrite and updated author bios, but left resume `shortBio` referring to Earthly while its body, author page data, and homepage referred to Pinecone. This is evidence for link preservation and consistency checks, not a standing instruction to set all future resumes to Pinecone.

The page's Segment call is an existing route behavior; content updates should not replace that integration. The default build regenerates RSS/sitemap too, even when only a resume changed. Those generated files are ignored outputs, not authoring targets.
