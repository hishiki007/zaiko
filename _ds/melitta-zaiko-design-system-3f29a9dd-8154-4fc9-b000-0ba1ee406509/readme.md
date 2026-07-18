# メリタ在庫管理 (Melitta Zaiko) Design System

A design system distilled from **メリタ部品在庫管理** ("Melitta Parts Inventory Management") —
a small, real-world shop-floor inventory tracker built as a single-file PWA. It manages parts
stock across five physical storage locations (a warehouse plus four technicians' personal
stock), backed by Firebase Realtime Database, with CSV/Excel import-export, a barcode/QR
lookup flow, an AI-assisted delivery-slip scanner (via the Anthropic API), and a maintenance
("点検") checklist/checkout feature. The app icon reads "Melitta®" — the tool appears to be
used internally by a shop that services or stocks parts for Melitta-brand equipment.

This is a **utility, not a marketing product**: five people on a shop floor need to see stock
counts and log a move in a few taps, often one-handed. Every design decision should serve
that job first.

## Sources

- GitHub: [hishiki007/zaiko](https://github.com/hishiki007/zaiko) — the single source of truth
  for this design system. It contains one file, `inventory-app.html`, plus an `icon.png` app icon.
  A copy of both lives in this project under `reference/` and `assets/` respectively.
- No Figma file, brand guideline doc, or additional codebase was provided. Everything here —
  colors, type, spacing, component inventory — was extracted directly from that HTML/CSS source.
- Explore the original repo further for the full application logic (Firebase wiring, the AI
  delivery-slip scanner, Excel export, QR scanning) — this design system only captures the
  **visual and interaction language**, not the backend behavior.

## Product context

- **Company / team**: メリタ在庫管理 (a small operating team — five named locations act as
  both a home warehouse and four individual technicians' personal stock).
- **Single product**: one mobile-first web app, used on phones in the field and a desk browser
  at the warehouse. There is no separate marketing site or second surface.
- **Core workflows**: look up a part → view stock across locations → adjust stock (入庫/出庫/
  direct-set) → transfer between locations → review history → (optionally) scan a delivery slip
  or QR code to speed up data entry.

## Substitutions & flags

- **Font**: no webfonts are shipped. The source deliberately uses the OS system-font stack
  (`-apple-system, BlinkMacSystemFont, 'Hiragino Sans', sans-serif`) so Japanese text renders
  via each platform's native Gothic face for free. This design system keeps that stack as-is —
  **no Google Fonts substitution needed or wanted**.
- **Icons**: the source app uses emoji (🔧📥📤↔📷✅ etc.) as its entire icon system — there is
  no icon font or SVG sprite in the repo. See ICONOGRAPHY below.
- **Logo**: `assets/melitta-icon.png`, copied verbatim from the source repo, is the only visual
  mark provided. It is a small app-icon-style PWA tile, not a full logo lockup — treat it as such.

---

## CONTENT FUNDAMENTALS

- **Language**: 100% Japanese UI copy, no bilingual labels. Written in a terse, businesslike
  register typical of internal shop tools — closer to a form label than a conversational voice.
- **Address form**: instructions are polite imperative (〜してください: "接続情報を入力して
  ください" / "納品書の写真を選択してください") — polite but brief, never chatty. There is no
  first-person "we" or marketing "you" — the copy just states what to do.
- **Casing**: no capitalization system to speak of (Japanese has none); English/Latin fragments
  (button labels borrowed from English concepts) are avoided entirely — even technical settings
  use Japanese: 接続情報, 保管場所, 数量.
- **Emoji as inline iconography, not decoration**: nearly every button and section head is
  prefixed with a single emoji that stands in for an icon glyph: `🔥 Firebase 設定`,
  `📥 CSVインポート`, `↔ 移動`, `📷 納品書スキャン`, `🔧 点検`. This is a deliberate,
  consistent pattern — emoji are functional labels, not flourishes, and always precede the text
  with one space, never trailing.
- **Numbers over adjectives**: quantities and counts are always shown as bare numbers next to a
  label (e.g. `シンワ倉庫: 12`), never described qualitatively ("in stock" / "low"). The one
  exception is the "ゼロ" (zero) state, which is styled faint rather than labeled.
  Where a *qualitative* flag does appear — an over-threshold caution, an unmatched scan result —
  it leans on the orange warning tint rather than an adjective, letting color carry the meaning.
- **Confirmations are short toasts**: `✅ 更新しました`, `🗑 削除しました`, `📄 CSVをダウンロード
  しました` — a checkmark/emoji + short past-tense verb, auto-dismissing. Errors are similarly
  terse: `部品名は必須です`, `移動元と移動先が同じです`.
- **Destructive actions get a native `confirm()` dialog** with the item name interpolated:
  `「${name}」を削除しますか？` — always includes the noun name in the question so the user
  knows exactly what they're about to remove.
- **No marketing tone anywhere.** No taglines, no exclamation-heavy enthusiasm, no emoji strings.
  This is closer to enterprise software copy than to a consumer app.

---

## VISUAL FOUNDATIONS

- **Color**: a clean, saturated **blue primary** (`#2563eb`) for the default/primary action,
  paired with a **strong orange** (`#d97706`) reserved for the "移動" (transfer) action and any
  cautionary banner (e.g. the CSV-overwrite warning uses an amber `#fef3c7` surface with
  `#92400e` text). Green (`#16a34a`) = stock increase / success / positive state. Red (`#dc2626`)
  = stock decrease / destructive. A one-off purple (`#7c3aed`) marks the "点検" (inspection)
  feature as a distinct, less-frequent mode. Neutrals are a cool slate scale — this is a
  functional-software palette, not a brand-expressive one.
- **Type**: system sans-serif only, one family for everything (no serif, no display face). Scale
  runs small and dense — 11–18px covers the entire UI — because the priority is fitting a lot of
  operational data into a phone screen, not typographic drama. Table headers are uppercased with
  wide tracking (`0.05em`) at 11px to read as metadata, not content.
  Numeric quantity cells are bumped up to 15px/700-weight so counts are the most scannable thing
  on the row.
  Monospace is used narrowly, only for part numbers (`部品番号`), to visually flag them as codes.
- **Spacing**: tight and consistent — 8/10/12/14/16px cover nearly every gap and padding in the
  app; 24px only appears in the largest card padding. No generous whitespace: this is a working
  tool where density = efficiency.
- **Backgrounds**: flat, solid colors only. No gradients, no photography, no illustration, no
  texture/pattern anywhere. The page background is a very light cool gray (`#f1f5f9`); every
  card/table/modal sits on pure white. The one "image" surface in the whole app is user-uploaded
  part photos and delivery-slip scans — never brand imagery.
- **Animation**: minimal and purely functional — a translateX slide for the history side panel
  (0.3s), a translateY + opacity fade for modals (0.2s), a fade for the toast (0.3s), and a
  `scale(0.97)` press-down on button `:active`. No entrance choreography, no bounce/spring easing
  — everything uses a plain linear/ease timing sized to feel instant, not designed.
- **Hover states**: primary buttons darken one step (`--primary` → `--primary-dark`); outline
  buttons fill with the page background tint; ghost buttons (used only in the header, on the
  colored bar) raise their translucent-white overlay from 15% → 25% opacity. No lightening,
  no shadows added on hover.
- **Press states**: every `.btn` shrinks to `scale(0.97)` on `:active` — the only press feedback
  in the system, applied universally regardless of button variant.
- **Borders**: a single hairline `1px solid #e2e8f0` is used everywhere something needs a subtle
  edge — inputs, table cells, chips, cards-in-cards. Selected/active states are communicated by
  swapping the border color to the accent (e.g. focused inputs get `border-color: var(--primary)`)
  rather than adding a second, thicker border.
- **Shadows**: soft and directional-down only, no glows except a small green `box-shadow` "online"
  dot pulse-glow. Elevation increases with the layer: the sticky header carries the strongest
  shadow (`0 2px 8px rgba(0,0,0,.2)`) since it's semi-opaque over content; cards are a soft
  `0 2px 12px rgba(0,0,0,.08)`; modals go dramatic (`0 20px 60px rgba(0,0,0,.25)`) to visually
  separate them from the page. No inner shadows anywhere.
- **Corner radii**: a clear scale by role — 6px thumbnails, 8px buttons/inputs, 10px tables/photo
  dropzones, 12px cards/modals, and a full pill (999px) for chips, badges, count bubbles, and the
  toast. Never square corners, never a radius above 12px on a rectangular container.
  Nothing uses a colored left-border accent bar as a card treatment — where history items need a
  type indicator, that's exactly the one place a 3px colored left border appears, and it maps
  directly to an operation type (move/add/edit/in/out), not decoration.
  Nothing uses a colored left-border accent bar as a general card motif elsewhere.
- **Cards**: white surface, 12px radius, soft shadow, no border (the shadow alone separates it
  from the page background). Table rows, by contrast, use flat hairline dividers with no shadow —
  reserve shadow+radius for discrete "cards" (setup card, modal, photo/scan modals) and use plain
  bordered rows for dense tabular data.
  A distinct row-level "just edited" state highlights the row with a very light blue tint
  (`#eff6ff`) and a 3px blue left border, paired with a small "操作済" (operated) pill — the
  system's one deliberate use of a left-border accent, reserved for "this is the row you just
  touched," not applied to cards in general.
- **Layout**: mobile-first single column. A sticky header (56px) and, immediately below it, a
  sticky toolbar+tab strip, keep search and the location filter reachable while scrolling a long
  table. A history drawer slides in from the right edge as a fixed-position panel (320px on
  desktop, full-width on mobile) rather than a route change or full-screen modal — it's meant to
  be glanced at, not focused on.
- **Transparency & blur**: transparency (not blur) is used narrowly — the header's ghost buttons
  sit on `rgba(255,255,255,0.15–0.25)`, and the modal scrim is `rgba(0,0,0,0.45)`. No
  backdrop-filter/blur anywhere in the source.
- **Imagery**: no brand photography exists in the source. The only images are functional:
  user-added part photos (small 40×40 thumbnails, object-fit: cover) and camera-captured delivery
  slips shown in a scan preview. Treat both as *user content*, not brand assets — don't invent
  a photography style for this brand.
- **Empty states**: a single large emoji (matching the section's theme, e.g. 🔧) over one line of
  muted gray text — no illustration, no CTA inside the empty state itself.

---

## ICONOGRAPHY

- **No icon font, no SVG sprite, no PNG icon set exists in the source.** The entire iconography
  system is **native emoji**, used as inline glyphs directly in button/label text: 🔧 (parts/
  inspection), 📥/📤 (in/out stock), ↔ (transfer), 📷 (camera/scan), 📱 (QR), 👤 (operator),
  📋 (history), ✏️ (edit), 🗑 (delete confirmation toast), ✅ (success toast), ⚠️ (warning banner),
  🔍 (search), ⚙️ (settings/master-edit), 📄/📊 (CSV/Excel export), 🔥 (Firebase setup).
  A plain `✕` character (not an icon glyph) is used for close buttons.
- This design system's components follow the same approach: **use emoji for icons, not hand-drawn
  SVGs.** Do not introduce a Lucide/Heroicons-style icon font — it would be inconsistent with the
  one real source of truth. If a consuming project needs an icon a plain emoji can't cover, flag
  it rather than inventing an SVG glyph from scratch.
- The one non-emoji glyph in the app is the ✕ close character and simple ✚ / − math glyphs used
  literally in button labels (`＋ 部品追加`, `📥 入庫 ＋`, `📤 出庫 −`) — full-width Japanese
  punctuation forms, not custom icon assets.

---

## Index

- `styles.css` — root stylesheet entry point (imports only). Link this one file.
- `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css` — CSS custom properties.
- `assets/melitta-icon.png` — the only visual mark provided by the source (PWA app-icon tile).
- `reference/inventory-app.html` — verbatim copy of the source app for direct reference.
- `guidelines/*.html` — foundation specimen cards (Colors, Type, Spacing, Brand) shown in the
  Design System tab.
- `components/core/` — Button, Field (Input/Select), Card, Badge/Chip, Tabs, Modal, Toast, Table
  row, Header, EmptyState, HistoryItem, PhotoDrop. See each component's `.prompt.md` for usage.
- `ui_kits/inventory/` — a click-through recreation of the inventory app's core screens (part
  list with location tabs, add/edit part, stock change, transfer, history drawer).
- `SKILL.md` — Claude Code-compatible skill wrapper for this design system.

## Intentional additions

- None yet beyond what the source defines. If a future request needs a primitive the source
  doesn't have (e.g. a Toast queue or a Tooltip), it will be listed here with a one-line reason
  before being added.
