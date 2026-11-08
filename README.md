# Open doors

A minimal, mobile-first opportunity tracker and source directory. Static, dependency-free, built for GitHub Pages.

## Use

Browse open opportunities, self-paced courses or the watchlist, filter by type/funding/region/progress, and open a card for the actual coverage, eligibility, deadline and official links. Sources is the reusable discovery directory. The initial research snapshot is **2 November 2026**, with a UAE events expansion verified **5 November 2026** and four additional events verified **8 November 2026**. It is not a live feed. There is no scheduled scraping or recurring search yet.

Statuses and private notes are saved **only in the current browser** with localStorage. No account or cross-device sync. Export/import a JSON backup to move progress between devices. Clearing site data can erase progress. Import merges records and replaces matching records only after confirmation. Event/source data in this repository is public; do not commit personal notes or CVs.

## Teach the search

Rate cards with 👍 (more like this) or 👎 (not for me). Disliked cards are hidden by default (**My take** filter). Open **Backup & privacy → Copy 👍/👎 for Claude** and paste the summary into a Claude session to refine the next research round. Ratings stay in this browser like your progress and are included in JSON backups.

## Run and test

Node 22 or newer; no dependency installation needed.

```sh
npm test
npm run build
python3 -m http.server 8000 --directory dist
```

## Publish

1. Push this source to a public GitHub repository with default branch `main`.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. The included workflow tests, builds and deploys on every push to `main`. Pull requests run tests/build without deployment. You can also run it manually from Actions.

No third-party secrets, database or paid hosting required. Deployment still depends on the repository owner's GitHub permissions and Pages eligibility.

## Maintain the directory

Edit `data/opportunities.json` and `data/sources.json`, then run `npm test`. When publishing data changes, bump the `v` query on the `app.js` script in `index.html`; the app uses it to refresh both data files without touching browser-local progress. Each opportunity has a stable ID (used by local progress), official links, an ISO verification date, funding details and caveats. Do not rename existing IDs. Use null for unknown dates rather than guessing. Each record has a `kind` (see `KINDS` in `core.js`). Availability (`open`, `ongoing` for self-paced/rolling courses with a `format`, `watchlist`, `excluded`) is separate from personal progress. Open entries need a start date and run at most 14 days. Funding `free` is for no-cost entry or courses, not covered travel. UAE event listings can include paid or unconfirmed access; always read the costs field. The UI automatically marks published open entries closed after their deadline or end date passes; it does not infer future calls.

Funding labels are deliberately cautious: full means an advertised package, not selection or reimbursement guaranteed. Conditional means a competitive/discretionary award or unclear airfare cap. Tuition-only scholarships must not be described as fully funded travel. Private summit organisers must not be labelled UN-backed simply because an institutional visit is mentioned.
