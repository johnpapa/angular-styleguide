# Copilot Instructions — Angular Style Guide

## Project Type

This is a **documentation-only repository** — markdown files containing style rules for Angular development. There is no source code to build or test.

## Writing Conventions

### The *Why?* Pattern

Every recommendation must include one or more `*Why?*:` bullets explaining the rationale. This is the signature pattern of the guide — never skip it.

```markdown
  *Why?*: One component per file promotes easier unit testing and mocking.

  *Why?*: One component per file makes it far easier to read, maintain, and avoid collisions with teams in source control.
```

### Code Examples

Always show both the wrong way and the right way:

```javascript
  /* avoid */
  // bad pattern here

  /* recommended */
  // good pattern here
```

### Style IDs

Every rule gets a unique ID in the format `[Style [Y###](#style-y###)]`. IDs are sequential within their category. When adding a new rule, use the next available number in the relevant section.

### Formatting

- Use ATX-style headings (`#`, `##`, `###`)
- Indent code blocks with 2 spaces inside list items
- End each section with `**[Back to top](#table-of-contents)**`
- Use fenced code blocks with `javascript` or `html` language identifiers

## Content Rules

- **Be opinionated** — "My recommended pattern is..." not "You might want to consider..."
- **Be specific** — real code, real patterns, real file names
- **Keep rules focused** — one concept per rule, one purpose per section
- **Explain tradeoffs** — when a rule has exceptions, note them

## Maintenance Matrix

| Change Made | Files to Update |
|---|---|
| New Angular 1 rule added | `a1/README.md` (rule + TOC entry) |
| Existing rule modified | `a1/README.md`, flag translations in `a1/i18n/` for review |
| New Angular 2+ rule added | `a2/README.md` |
| Style ID numbering changed | Update all references in the TOC and cross-links |
| New translation added | `a1/i18n/{locale}.md`, update root `README.md` if needed |
| Assets added (images, snippets) | `a1/assets/`, reference from the relevant guide |
