# Angular Style Guide — Agent Guide

## Project Overview

*Opinionated Angular style guide for teams by [John Papa](https://github.com/johnpapa).* This is the most widely adopted Angular style guide (26k+ stars), endorsed by the Angular team. It provides conventions for building Angular applications — syntax, structure, naming, and patterns — with *Why?* explanations for every recommendation.

This is a **documentation-only repository**. There is no source code, no build system, no test framework, and no runtime dependencies. The deliverables are markdown files.

## Repository Structure

```
angular-styleguide/
├── README.md              # Root — links to version-specific guides
├── a1/                    # Angular 1 (AngularJS) style guide
│   ├── README.md          # The full Angular 1 guide (~3,300 lines)
│   ├── assets/            # Images, code snippets, editor templates
│   └── i18n/              # Community translations (15+ languages)
├── a2/                    # Angular 2+ style guide
│   ├── README.md          # Angular 2 guide (references official docs)
│   └── notes.md           # Development notes
├── LICENSE                # MIT
└── .github/               # GitHub configuration (AI-ready assets)
```

## Tech Stack

- **Content format:** Markdown
- **No runtime, build system, or test framework** — this is a documentation project

## Build & Run

There is no build step. The content is read directly on GitHub or cloned locally. To preview markdown locally, use any markdown viewer or VS Code preview.

## Testing

There are no automated tests. Validation is manual:
- Read the markdown for accuracy and completeness
- Verify code examples compile and follow the conventions they describe
- Check that links are not broken

## Key Patterns and Conventions

- **The *Why?* pattern** — every rule has one or more `*Why?*:` bullets explaining the rationale
- **Style IDs** — each rule has a unique ID (e.g., `[Style Y001]`) for easy reference
- **Avoid / Recommended** — code examples show both the wrong way (`/* avoid */`) and the right way (`/* recommended */`)
- **LIFT principle** — Locate, Identify, Flat, Try DRY (Y140-Y144)
- **ATX headings** — `#`, `##`, `###` for structure
- **Back to top links** — `**[Back to top](#table-of-contents)**` after each section

## Adding a New Style Rule

1. Choose the appropriate guide (`a1/README.md` for AngularJS, `a2/README.md` for Angular 2+)
2. Assign a new Style ID following the numbering convention (e.g., `Y250` for the next in sequence)
3. Write the rule with:
   - A descriptive heading
   - The style ID as a subheading: `###### [Style [Y250](#style-y250)]`
   - One or more `*Why?*:` bullets
   - `/* avoid */` and `/* recommended */` code examples
4. Add a `**[Back to top](#table-of-contents)**` link at the end
5. Add the rule to the Table of Contents at the top of the guide
6. If the rule applies across languages, update translations in `a1/i18n/`

## Documentation

This project **is** documentation. The guides live in:
- `a1/README.md` — Angular 1 style guide (primary, most complete)
- `a2/README.md` — Angular 2+ style guide (references official Angular docs)

Translations are maintained by the community in `a1/i18n/`.

## Common Pitfalls

- **Don't forget the Table of Contents** — every new rule must be added to the TOC at the top of the guide
- **Translations go stale** — when updating `a1/README.md`, the 15+ translations in `a1/i18n/` may need updates. Flag this in the PR but don't auto-update translations.
- **Code examples must be valid** — the `/* avoid */` and `/* recommended */` examples should be syntactically correct JavaScript/TypeScript
- **Default branch is `master`** — not `main`
