# NewsDailly — Scaffold

Minimal React 18 + Vite + Tailwind 3 + Firebase v10 (Firestore + Storage) + react-router-dom@6 + react-helmet-async scaffold.

## Quickstart

```bash
pnpm i   # or: npm i / yarn
cp .env.example .env  # fill Firebase keys
pnpm dev  # or npm run dev
```

- HelmetProvider is wired in `src/main.jsx`.
- Firebase `db` and `storage` read from `.env`.
- Dark/light theme toggle persists via `localStorage: theme`.

## Project Structure

- `src/firebase.js` — exports `{ db, storage }`, plus `COLLECTION_NAME`, `STORAGE_FOLDER`.
- `src/utils/adapters.js` — `adaptArticle(doc)` normalizes docs:

```yaml
{
  title, slug, publishedAt: Date, metaDescription,
  lsiKeywords: [], tags: [], tagline, faq: [],
  schemaLd: {}, intro, sections: [{title,text}…],
  conclusion, author, readTime: "5 minutes", category?: string
}
```

Mappings:
- `publishedat` → `publishedAt` (Date)
- `meta_description` → `metaDescription`
- `introduction` → `intro`
- Build `sections` from `section1*`, `section2*`, `section3*` if present
- `readTime` from `meta.read_time` else computed ~ words / 225 + " minutes"
- If `category` missing, infer from tags (`scam`, `airdrop`, `fresh`, `callout`) else default **Fresh Hitters**

## Pages

- `/` — Home with client-side category chips and infinite scroll (server query orders by `publishedat desc`).
- `/category/:name` — Server-side filtered (exact, case-sensitive among: Fresh Hitters | Airdrop Alerts | Scam Alerts | Callout Projects). Paginates independently.
- `/article/:slug` — Single article. Loads hero image from Storage `${STORAGE_FOLDER}/${slug}.(webp|jpg|png)`.

## SEO

- `src/components/SEO.jsx` — `SiteSEO` (Organization JSON-LD) & `ArticleSEO` (NewsArticle JSON-LD). OG/Twitter tags included.
- `src/utils/urls.js` — builds canonical via `VITE_SITE_URL`.

## Image Helper

- `src/components/ImageFromStorage.jsx` — tries `.webp`, then `.jpg`, `.png` via `getDownloadURL`, with skeleton + SVG placeholder. Also exports `resolveStorageImageUrl(slug)`.

## Performance & A11y

- Route-level code-splitting (`React.lazy` + `Suspense`)
- All images have `width`/`height` and `loading="lazy"` to avoid CLS
- Tailwind Typography for readable article content

## Seeding

Provide your sample JSON in `/data/sample-newarticles.json`, then:

```bash
# Set GOOGLE_APPLICATION_CREDENTIALS to your Firebase Admin service account JSON
export GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/serviceAccount.json
pnpm run seed
```

This writes docs into the `newarticles` collection **as-is** (no key renames). After seeding, open `/` and `/article/:slug`.

### Composite Index (Firestore)

For `/category/:name` page you may need:

```json
{
  "indexes": [
    {
      "collectionGroup": "newarticles",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "publishedat", "order": "DESCENDING" }
      ]
    }
  ]
}
```

In Firebase console → Firestore Database → Indexes → Composite → Add.

## Assets

Place a placeholder logo at `public/assets/logo.webp` (any small image).
