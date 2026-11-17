# Timur Nadrshin · System analysis portfolio

[Open the website](https://bivaettttt.github.io/portfolio/en/) · [Русский README](README.md)

A bilingual professional profile, project directory, analysis cases and walkthroughs grounded in repository evidence. Nine independent learning systems sit alongside selected coursework and applied work.

```sh
npm ci
npm run dev
npm run verify
npx playwright install chromium
npm run test:browser
```

Open `http://127.0.0.1:4321/portfolio/en/`. Astro generates static documents under `/portfolio/`. Add a case in `src/content/projects/<category>`; Content Collections validate both languages. GitHub Actions test the static package and publish from `main`.

- [Route and navigation model](docs/information-architecture.md)
- [Evidence inventory](docs/content-evidence.md)
- [Project status](docs/PROJECT_STATUS.md)
