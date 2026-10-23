# Plan: Resources & Blog PDF Download + Admin Upload

## Scope (only this part)
Resources page, blog posts, admin upload for resources/blogs/vlogs, PDF download, color theme, AI-friendly (frontier model) SEO. Do not touch other modules.

## Mistakes identified
1. `ResourcesPage.tsx`: `downloadable: true` flag is declared but never used; no PDF download link rendered. Only "Read Online" and "Request Spec".
2. Resources are hardcoded; no fetch from backend resources table; admin cannot add/edit/delete resources.
3. `blogController.js`: no PDF generation/export endpoint; blogs stored as HTML content only.
4. Admin controller: no resource upload/management endpoints; only blogs.
5. No PDF route on frontend (e.g. `/resources/:slug.pdf` or download button).
6. No structured data / semantic HTML for AI crawlers (frontier models): missing JSON-LD, OpenGraph, canonical, article metadata, sitemap entries for resources/blogs.
7. Color theme inconsistency: resource cards use inline styles not tied to global theme tokens; PDF styling not defined.

## Plan
### Backend
- Add `resources` table (id, title, slug, category, type, description, content, pdf_url, image_url, downloadable, updated_at).
- Add resource CRUD controller + routes (admin-protected create/update/delete; public list/get).
- Add PDF generation: endpoint `GET /api/resources/:slug/pdf` and `/api/blogs/:slug/pdf` returning PDF (puppeteer/pdfkit or html-to-pdf). Store generated PDF or stream.
- Blog controller: ensure `pdf_url` field; add download endpoint.
- Add vlog support: `vlogs` table or reuse blogs with type=vlog; admin upload.

### Frontend
- ResourcesPage: fetch from `/api/resources`; render "Download PDF" button when downloadable; filter by category/search.
- BlogPost: add "Download as PDF" button; print-friendly CSS.
- AdminDashboard: forms to upload resource/blog/vlog (title, content, category, file/PDF, image).
- Color theme: use CSS variables consistently; add print stylesheet for PDF.

### AI/Frontier-model optimization
- Add JSON-LD (Article, TechArticle) to blog/resource pages.
- Semantic headings, alt text, meta descriptions, canonical URLs.
- Sitemap include resource/blog/vlog URLs.
- robots.txt allow AI crawlers; llms.txt with site summary.
- Clean, readable markdown-like content for ingestion.

### Verification
- Test PDF download returns valid PDF.
- Test admin upload creates resource visible on site.
- Lint/typecheck.

## Out of scope
Auth, payments, partners, contacts, other pages.
