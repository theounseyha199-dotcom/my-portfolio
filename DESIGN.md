# Seyha Portfolio Design

## Direction

A developer portfolio for visitors who want to understand Seyha's work quickly. The first screen pairs an editorial introduction with one crafted code workspace. The workspace represents frontend, backend, and product thinking using technologies already listed in `src/data/portfolio.ts`; it is an illustration, not a simulated IDE. The portrait remains in About.

The signature is the contrast between oversized, direct typography and a precise, compact editor artifact. Space around those two elements supports the hierarchy. Avoid orbital diagrams, unrelated floating cards, heavy grids, and dashboard chrome.

## Visual tokens

The dark palette is the default and lives in `src/app/globals.css`; `src/app/theme-light.css` supplies its coordinated light counterpart. The navbar control lets visitors choose a theme, and the choice persists across reloads and tabs. The page does not follow operating-system theme settings.

| Token | Value | Role |
| --- | --- | --- |
| `--bg` | `#080b12` | Near-black canvas |
| `--bg-soft` | `#0d1420` | Quiet secondary surface |
| `--panel` | `#101b2a` | Cards |
| `--panel-raised` | `#162438` | Image and raised surfaces |
| `--line` | `#29405a` | Borders |
| `--text` | `#f8fafc` | Primary copy |
| `--muted` | `#a4b4c6` | Supporting copy |
| `--blue` | `#4b9bea` | Interactive accent |
| `--cyan` | `#67d3ed` | Technical highlight and focus |
| `--radius-card` | `14px` | Shared card corners |
| `--section-space` | `clamp(84px, 8vw, 116px)` | Desktop section rhythm |

The light palette maps the same surface, text, and accent roles to a light canvas. The code workspace, project preview art, and contact panel retain their dark surfaces as intentional contrast anchors.

Google Sans Code is the only typeface, loaded through `next/font/google` with a monospace fallback. The Hero uses large, tight-set type; paragraphs use more generous line height. Cyan appears in small labels and purposeful accents. The primary CTA has a light blue fill for quick recognition. Borders and glow stay restrained.

## Layout

The desktop Hero uses asymmetric text and visual columns within the 1260px container. At tablet width the editor moves below the copy; on phones the editor rail disappears and code sizing compresses without horizontal overflow. CTA labels remain large enough to tap. The About portrait keeps its 3:4 source ratio.

## Behavior

Section anchors and a shared Motion indicator provide navigation. The mobile menu closes after selection or Escape and restores focus after Escape. Hero text and the editor enter once with short transform animations; their server-rendered content remains visible before hydration. Reduced-motion preference disables spatial motion. The editor chrome is illustrative rather than clickable. Project and experience details remain accessible disclosures. Unconfigured contact, social, and project destinations stay hidden.

The supplied `public/logo.png` is the brand mark in both header and footer. Its wide canvas is framed with a fixed crop in CSS so the central S remains legible; the source asset is not altered. The header mark is 38 × 38px, while the footer mark is larger. The adjacent `seyha.dev` text provides a readable name. Interface icons use React Icons for a consistent visual system; symbols inside the editor are code content.
