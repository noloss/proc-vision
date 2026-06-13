---
name: caps-portal-prototype-design
description: Design spec for the CaPS customer portal prototype — Vite + React + Tailwind, deployed to GitHub Pages at noloss/proc-vision. Four views: CategorySelect, Upload, Review, Status.
metadata:
  type: project
---

# CaPS Customer Portal Prototype — Design Spec

## Context

This prototype demos the Stage 5/6 customer-facing upload and extraction review portal from the CaPS cost analysis pipeline. It is built for a case interview for Head of Product & AI at CaPS Procurement Service. It must be deployable to GitHub Pages at `https://noloss.github.io/proc-vision/`.

## Stack

- Vite + React (JSX)
- Tailwind CSS via `@tailwindcss/vite`
- `react-router-dom` for routing
- No other runtime dependencies
- Deploy target: GitHub Pages (`base: '/proc-vision/'` in `vite.config.js`)

## Design Tokens

| Token | Value |
|-------|-------|
| Navy | `#1F2A44` |
| Teal | `#2FA37C` |
| Card bg | `#EDF3F9` |
| Amber | `#F59E0B` |
| Error red | `#EF4444` |
| Approved green bg | `#ECFDF5` |
| Font | Inter (Google Fonts) |

## File Structure

```
public/
  7600881.jpg         ← second invoice image (Upload doc preview)
  8503509.jpg         ← primary invoice image (Review left column)
src/
  data.js             ← all hardcoded content
  App.jsx             ← AppContext + BrowserRouter + routes
  components/
    TopBar.jsx
  views/
    CategorySelect.jsx
    Upload.jsx
    Review.jsx
    Status.jsx
```

## State Management

A single `AppContext` in `App.jsx` wraps the router. It holds:

- `selectedCategories: string[]` — IDs chosen in CategorySelect
- `uploadedCategories: string[]` — IDs marked uploaded in Upload

All views read from context. Upload writes `uploadedCategories`. Survives back navigation.

## Routing

| Path | View | TopBar step label |
|------|------|-------------------|
| `/` | CategorySelect | "Step 1 of 3 · Select categories" |
| `/upload` | Upload | "Step 2 of 3 · Upload documents" |
| `/review` | Review | "Step 3 of 3 · Review flagged items" |
| `/status` | Status | "Hartmann & Co · Submitted" |

## TopBar Component

Always visible. Navy background, white text. Left: "CaPS" bold. Right: "Hartmann & Co" + step label prop.

## data.js

All mock content lives here. Nothing hardcoded in components.

### Categories (12)

```js
{ id: 'office', label: 'Office supplies', icon: '📦', desc: 'Paper, pens, desk items' },
{ id: 'it', label: 'IT hardware', icon: '💻', desc: 'Laptops, monitors, peripherals' },
{ id: 'print', label: 'Print & copy', icon: '🖨️', desc: 'Printers, toner, managed print' },
{ id: 'software', label: 'Software & licences', icon: '🔑', desc: 'SaaS, productivity tools' },
{ id: 'mobile', label: 'Mobile & telecoms', icon: '📱', desc: 'Phones, SIM plans, broadband' },
{ id: 'facilities', label: 'Facilities & cleaning', icon: '🧹', desc: 'Cleaning services and supplies' },
{ id: 'travel', label: 'Travel & accommodation', icon: '✈️', desc: 'Flights, hotels, rail' },
{ id: 'energy', label: 'Energy & utilities', icon: '⚡', desc: 'Electricity, gas, water' },
{ id: 'courier', label: 'Courier & freight', icon: '📬', desc: 'Parcel, pallet, express' },
{ id: 'workwear', label: 'Workwear & PPE', icon: '👷', desc: 'Uniforms, safety equipment' },
{ id: 'coffee', label: 'Coffee & catering', icon: '☕', desc: 'Hot drinks, vending, catering' },
{ id: 'packaging', label: 'Packaging', icon: '📦', desc: 'Boxes, tape, labels' },
```

### Sample filenames

```js
{ office: 'staples_invoice_2024.pdf', it: 'dell_q1_2024.pdf', software: 'microsoft_ea_2024.pdf', mobile: 'vodafone_nov_2024.pdf', ... }
```

### Invoice line items (9 rows)

| id | desc | ref | qty | unit | price | notes |
|----|------|-----|-----|------|-------|-------|
| 1 | HP 80g A4 Paper Ream 500sh | HP-A4-80 | 40 | ream | 4.85 | auto-match |
| 2 | Staedtler HB Pencils Box 12 | ST-HB12 | 10 | box | 2.30 | auto-match |
| 3 | Avery L7160 Address Labels | AV-7160 | 25 | pack | 3.90 | match_review (72%) |
| 4 | Fellowes Apex Shredder Bags | FE-4600 | 6 | pack | 18.50 | extraction_error (extractedPrice: 1.85) |
| 5 | Post-it 76x76mm Yellow 100sh | 3M-654 | 20 | pad | 1.45 | auto-match |
| 6 | Bic Cristal Biro Blue 50pk | BIC-CR50 | 4 | box | 5.20 | auto-match |
| 7 | Esselte Lever Arch File A4 | ES-LAF | 12 | unit | 2.85 | auto-match |
| 8 | Scotch Magic Tape 19mm 8-pack | 3M-M8 | 8 | pack | 6.40 | no_match |
| 9 | Whiteboard Marker Assorted 4pk | ST-WB4 | 5 | pack | 3.10 | auto-match |

### Match candidates for row id=3 (Avery Labels)

```js
{ name: 'Avery L7163 Address Labels', unit: 'pack', capsPrice: 4.10, score: 72 },
{ name: 'Avery L7160 Labels 21-up', unit: 'pack', capsPrice: 3.85, score: 68 },
{ name: 'Avery L7651 Mini Labels', unit: 'pack', capsPrice: 2.95, score: 51 },
{ name: 'Q-Connect Address Labels A4', unit: 'pack', capsPrice: 3.20, score: 44 },
{ name: 'Avery Laser Labels White 24-up', unit: 'pack', capsPrice: 4.50, score: 38 },
```

Auto-matched rows each have a `capsMatch: { name, price, savings }` field.

## View 1 — CategorySelect (`/`)

- 3-col responsive grid (2-col on mobile) of category cards
- Card: large icon, bold name, small grey descriptor
- Click toggles selected: teal border + background tint + checkmark badge top-right
- Pre-selected: office, it, software, mobile
- Sticky bottom bar: "N categories selected" left, "Continue →" teal button right (disabled at zero)
- On continue: writes selected IDs to context, navigates to `/upload`

## View 2 — Upload (`/upload`)

Three sub-states via `useState('form' | 'processing' | 'results')`.

### form state

- Vertical list of selected categories as cards
- Each card: icon + name, "Awaiting upload" badge, dashed upload zone (visual only)
- "Use sample data →" link: marks category uploaded, replaces zone with file chip (filename from SAMPLE_FILES), badge → green "Uploaded ✓"
- Once ≥2 categories uploaded: sticky bottom bar shows "Process documents →"

### processing state

- Full-screen overlay (backdrop blur, dark semi-transparent)
- Centred: "Reading your documents…", teal animated progress bar (CSS, 0→100% over 2.5s)
- Status message cycles every 700ms: "Extracting line items…" / "Normalising units and currencies…" / "Running quality checks…" / "Matching to CaPS price list…"
- After 2.5s: transition to results state

### results state

- Large teal checkmark, heading "Processing complete"
- "15 line items extracted and matched automatically." + "3 line items need your review."
- Section 1 — "Matched automatically": collapsed by default, toggle to expand. Summary: "15 items across Office supplies, IT hardware, Software & licences". Expanded: category list with item counts.
- Section 2 — "Needs your review": expanded by default. Three cards:
  - "Fellowes Apex Shredder Bags" · amber "Extraction unclear — unit price may be wrong" · Office supplies
  - "Avery L7160 Address Labels" · amber "Low confidence match (72%) — please confirm" · Office supplies
  - "Scotch Magic Tape 19mm 8-pack" · amber "No CaPS equivalent found" · Office supplies
- Amber warning card: "⚠ File too coarse to use — The file for Facilities & cleaning ("facilities_q3_summary.pdf") contains no line-level detail. Ask your supplier for an itemised invoice."
- Sticky bottom bar: "Review 3 items →" (teal, navigates to /review) + "Skip and submit anyway" ghost button (shows inline confirm "This may reduce accuracy. Confirm?" with Yes/Cancel)

## View 3 — Review (`/review`)

Two-column layout filling viewport below TopBar. Both columns scroll independently (`overflow-y: auto`, height = `100vh - topbar height`).

### Left column (40%) — document viewer

- `8503509.jpg` displayed as primary invoice (white card, drop shadow)
- `7600881.jpg` displayed below it as second document
- Below both images: extracted line items table (all 9 rows from data.js)
- Row matching `focusedRowId` state gets soft yellow background (`#FEFCE8`)

### Right column (60%) — ReviewTable

- Sticky sub-header: "3 items flagged · Office supplies · INV-2024-8821"
- Local `useState` per row with status: `'auto' | 'extraction_error' | 'match_review' | 'no_match' | 'approved'`
- Hovering/focusing a row updates `focusedRowId` → highlights invoice table row on left

#### Row rendering by status

**auto (6 rows):** All fields locked. Teal chip with matched name + CaPS price. Savings in teal. "Ready" green badge. "✓ Approve" button → moves to approved.

**extraction_error (row 4 — Fellowes Shredder Bags):** "Needs review" amber badge. Unit price is `<input type="number">` with amber border, pre-filled with `1.85`. `onChange` recalculates and shows live total (qty × value). CaPS match column: greyed italic "Resolve extraction first". "Correct & continue →" button enabled only when value differs from `1.85`. On click: locks input, reveals match chip (Fellowes SB-125i Bags 100pk · €17.90/pack · 94%) + "Approve match" button. "Approve match" → approved, green bg.

**match_review (row 3 — Avery Labels):** Extraction locked. "Review match" yellow badge. Top candidate chip + confidence bar (72%) + "Change ›" link. Clicking opens MatchDropdown — a positioned div with search `<input>` at top, 5 candidates below (name bold, unit + CaPS price small grey, similarity bar + %). Real-time filter as user types. Click candidate → selects and closes. Outside-click closes (useEffect with document click listener, cleaned up on unmount). "Approve match" → approved, green bg.

**no_match (row 8 — Scotch Tape):** "No match" red badge. Match column: "No CaPS equivalent found" grey italic. "Flag for manual review" → status = flagged, badge → "Flagged" grey. Flagged rows do not block submission.

**approved:** Full row bg `#ECFDF5`. "Approved" teal badge. All fields locked.

#### Bottom bar

Fixed to bottom of right column/page. "N of 3 resolved" (reactive). "Approve all & submit →" teal button — disabled until rows 3 and 4 are approved (row 8 can be approved or flagged). On click: button text → "Submitted ✓", then `navigate('/status')` after 800ms.

## View 4 — Status (`/status`)

- No step label. TopBar shows "Hartmann & Co · Submitted".
- Centred content, max-width 680px
- Large teal checkmark SVG, heading "Your documents have been submitted"
- Subtext: "CaPS will complete the review and send a savings estimate within 2 business days. We'll email otto@hartmann.de when it's ready."
- Category status cards (one per originally selected category):
  - Submitted categories: "Under review" teal badge · "Submitted 14 Jun 2026, 11:42"
  - Facilities & cleaning: "File issue" amber badge · "Upload an itemised invoice to include this category" + "Upload new file ›" ghost link (non-functional)
  - Unsubmitted categories: "Not submitted" grey badge · "No file uploaded"
- "← Start a new analysis" ghost button → resets context, `navigate('/')`

## Build & Deploy

```bash
npm run build    # verify no JSX errors
npm run preview  # local preview at /proc-vision/ base path
```

GitHub Pages: push `dist/` contents to `gh-pages` branch (or configure Pages to serve from `dist/` on main).

`vite.config.js`:
```js
export default defineConfig({
  base: '/proc-vision/',
  plugins: [react(), tailwindcss()],
})
```
