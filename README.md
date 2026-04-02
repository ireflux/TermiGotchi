# TermiGotchi

`TermiGotchi` is a standalone static web app for building, styling, and sharing an ASCII terminal pet.

Page title:
- `Terminal Tamagotchi`

Core traits:
- standalone project
- no backend
- GitHub Pages friendly
- default `Green CRT` terminal theme
- editable appearance, stats, `name`, and `personality`
- shareable URL state
- `PNG`, `TXT`, and `JSON` export

## Local Development

Requirements:
- Node.js 22+
- npm 10+

Commands:

```bash
npm install
npm run dev
```

Typecheck:

```bash
npm run typecheck
```

Production build:

```bash
npm run build
```

Preview the built app:

```bash
npm run preview
```

## GitHub Pages

This project includes a Pages workflow at [deploy.yml](./.github/workflows/deploy.yml).

Recommended repository settings after moving `TermiGotchi` into its own repo:

1. Push the project to a repository with `main` as the default branch.
2. In GitHub repository settings, enable `Pages`.
3. Set the Pages source to `GitHub Actions`.
4. Push to `main` or run the workflow manually.

The Vite config uses a relative asset base, so the app can be published from a repository Pages path without hardcoding the repo name.

## Project Structure

```text
TermiGotchi/
|-- .github/workflows/
|-- docs/
|-- public/
|-- src/
|-- index.html
|-- package.json
|-- tsconfig*.json
`-- vite.config.ts
```

## Docs

- [PRD v1](./docs/prd-v1.md)
- [Information Architecture](./docs/information-architecture.md)
- [Page Copy Draft](./docs/page-copy-draft.md)
- [Data Constants Table](./docs/data-constants.md)
- [Implementation Task Breakdown](./docs/implementation-breakdown.md)

## Current Status

Implemented:
- builder view
- gallery view
- about view
- terminal themes
- sprite preview and lightweight reactions
- command completion
- sharing and export

Still open for future refinement:
- final species-by-species stage tuning
- tighter buddy-style motion polish
- final content and screenshot pass before public release

## Release Checklist

- update the repository description and homepage URL
- enable GitHub Pages with `GitHub Actions`
- push a production screenshot into the repo and link it from this README
- verify exported files use the naming you want publicly
- test one share URL on desktop and mobile before announcing the project
