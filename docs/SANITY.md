# Sanity CMS — setup & editing guide

## Website admin panel (recommended way to edit)

Go to **https://weselldeadlots.com/admin** (locally `http://localhost:3000/admin`) and sign in with the
admin password. Everything is in plain language: Website basics, Top menu, Footer, Home page, Contact page,
Sell with us page, Blog page, Other pages and Blog articles. Change anything, then press
**Publish changes** (or Ctrl + S) — the website updates immediately.

It needs these environment variables (server-only, never `NEXT_PUBLIC_`):
- `ADMIN_PASSWORD` — the password for /admin. Pick a long one.
- `ADMIN_SESSION_SECRET` — any random string of 32+ characters (signs login sessions).
- `SANITY_API_WRITE_TOKEN` — an **Editor** token from sanity.io/manage → API → Tokens (used to save changes).

Sanity Studio at `/studio` still works for advanced tasks (image crop/hotspot, revision history).

The site's content (navbar, footer, homepage sections, contact page, sell-with-us page, blog page text,
privacy/terms and any new pages) is managed in **Sanity Studio** at `/studio`.
Products, collections and the existing blog articles still come from **Shopify**.

Until a Sanity project is connected, the site renders the original content from
`sanity/seed/content.js`, so nothing breaks before setup.

## 1. Create and connect the Sanity project (one time)

1. Create a free project at <https://www.sanity.io/manage> (dataset name: `production`).
2. Copy `.env.example` values into `.env.local` (and into your hosting provider's env settings):
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` — from sanity.io/manage
   - `NEXT_PUBLIC_SANITY_DATASET=production`
   - `NEXT_PUBLIC_SITE_URL=https://weselldeadlots.com`
   - `SANITY_API_READ_TOKEN` — API → Tokens → add a **Viewer** token (draft previews)
   - `SANITY_REVALIDATE_SECRET` — any long random string (webhook)
3. Allow the Studio to talk to Sanity: sanity.io/manage → API → CORS origins → add
   `http://localhost:3000` and `https://weselldeadlots.com`, both **with credentials**.

## 2. Migrate the existing content

1. Add a temporary **Editor** token as `SANITY_API_WRITE_TOKEN` in `.env.local`.
2. Run:
   ```bash
   npm run sanity:seed
   ```
   This creates Website Settings, Navigation, Footer, Homepage, Contact Page, Sell With Us Page,
   Blog Page Settings, Privacy Policy and Terms pages, and uploads all 49 images/videos from `/public`.
   It never overwrites documents that already exist (use `npm run sanity:seed -- --replace` to reset them).
3. Remove `SANITY_API_WRITE_TOKEN` afterwards — the website never needs it.

## 3. Instant updates on publish (webhook)

sanity.io/manage → API → Webhooks → Create:
- URL: `https://weselldeadlots.com/api/revalidate`
- Dataset: `production`, Trigger on: Create, Update, Delete
- Projection: `{_type, "slug": slug.current}`
- Secret: the same value as `SANITY_REVALIDATE_SECRET`

Without the webhook, changes still appear within ~60 seconds.

## 4. Editing content

Open `https://weselldeadlots.com/studio` (or `http://localhost:3000/studio`) and sign in. Only people invited
to the project (sanity.io/manage → Members) can edit.

| Studio item | Controls |
|---|---|
| Website Settings | Name, logos, favicon, brand colours, contact details, WhatsApp button, social links, default SEO, announcement bar, copyright, schema.org data |
| Navigation | Logo, menu items (+ dropdowns), desktop & mobile "Sell with us" buttons, search / language toggles |
| Footer | Link columns, map, logo, contact/social toggles, newsletter/CTA block, legal links, copyright |
| Homepage | Ordered sections: Hero, Product carousel (Shopify collection), Category browser, All products grid, plus any page section |
| Contact Page | Heading, text, map, form labels/messages, FAQs, SEO |
| Sell With Us Page | Hero, labels, placeholders, dropdown options, SEO |
| Blog Page Settings | Blog listing and article page text, SEO |
| Pages | Privacy, Terms and any new page |
| Blog Posts | Articles written in Sanity (shown before Shopify articles) |

Edit, then press **Publish**. Drag sections to reorder; use "Hide this section" to hide without deleting.
The **Presentation** tab previews unpublished drafts on the live site.

## 5. Creating a new page

Studio → Pages → **+** → enter a title, generate the slug, add sections (e.g. Page header, Rich text,
Image with text, FAQ, Call to action…), fill in SEO, Publish. It is live at `/<slug>` and added to the sitemap.
Set Visibility to "Hidden" to take it offline.

## 6. SEO

Every page has an SEO tab: title, description, keywords, canonical URL, noindex/nofollow, Open Graph and
Twitter title/description/image, and optional JSON-LD. Empty fields fall back to Website Settings → Default SEO.

## 7. Deploying

Add the env vars from step 1 to your host, then deploy as usual (`npm run build`). Content edits after that
need no redeploy.
