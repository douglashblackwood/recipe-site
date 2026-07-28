# recipe-site

Static household cookbook site, published via GitHub Pages from `docs/` on `main`.

**Live URL**: https://douglashblackwood.github.io/recipe-site/

## ⚠️ PUBLIC REPO — the one exception

This is Douglas's only **public** GitHub repo (free GitHub Pages requires it). Hard rules:

- **Never commit personal data**: no family first names, no calendars, no meal plans, no cooking history, no health/finance anything. Recipes and the BIR reference only.
- Name-bearing source attributes are published generically ("Easy cook?"); dietary rules are phrased as "the house no-heavy-dairy rule" etc.

## Architecture

- **Source of truth stays in `~/Projects/meal-planner/`** (recipe `.md` files + `recipes-index.json`) and `~/Projects/bir-curry-reference/index.html`. This repo holds only the generated/published site.
- Pages are **hand-crafted by Claude** (Douglas's choice, 11/06/2026): no build script. Units were cleaned up from the meal-planner files (e.g. "Chicken Breast: 1000" → "1 kg chicken breast") with per-recipe judgment.
- `docs/style.css` is the shared design system (cookwell.com-inspired: Fraunces + Inter, warm cream, category colours). `docs/index.html` has the search/filter JS; each recipe page has a small inline script for tickable ingredients and tap-to-complete steps (persisted in localStorage).
- **Design refresh (03/07/2026):** light + dark palettes via `prefers-color-scheme` (auto, no toggle); illustrated editorial index: poster-scale masthead ("Blackwood *Kitchen*", hero still-life), sections (Curries, Everyday Mains, Pasta, Fish & Seafood, Korean & Vietnamese, Project Cooks, Components) each headed by a colour-washed band with its own gouache illustration, filter JS hides empty sections; a "Tonight" strip appears in the masthead when the plan feed has today's dinner; the BIR reference is a normal card in Curries (deliberately demoted 03/07, not a hero banner — don't re-elevate it); cards get a category-colour wash + hover lift; recipe meta pills are a hairline strip (CSS-only, same HTML); every recipe/component page has a fixed "Cook mode" button (bigger type + screen wake-lock; wake-lock needs HTTPS so it works live but not on file://); print stylesheet included. `docs/.nojekyll` makes Pages serve files raw (a Jekyll build jammed 03/07; don't remove it). New recipe pages must include the cookbtn button + its script block (copy from any existing page) AND the feedback include `<script src="../feedback.js" defer></script>` before `</body>`.
- **Feedback loop (11/07/2026):** `docs/feedback.js` appends a "Cooked this?" form to every recipe page (date, quantities-as-written?, corrections pre-filled from the page's own ingredient list, active minutes, rating, notes). POSTs JSON to a household Apps Script endpoint (`google-apps-script-toolkit/projects/recipe-feedback/`) writing to a private sheet; the weekly meal-planner ingest applies corrections back to the source .md, this site's page, and the MFP change-list. The endpoint URL + token in feedback.js are spam guards, not secrets; submissions are reviewed on ingest, never auto-applied. No feedback data is stored in this repo.
- `docs/bir-curry-system.html` is a copy of `bir-curry-reference/index.html` with a back link injected after `<div class="wrap">`.

## Current state (28/07/2026)

- **33 recipes + 3 components + the BIR reference.** Frittata (feta rejected) and Parmesan Crumbed Fish removed; 6 Korean/Vietnamese trial recipes added (green "trial" pills), Jalfrezi + Saag Balti converged onto the BIR system, pizza upgraded (cold ferment, pizza oven). Four Tommy Cole trials added 28/07/2026 (Tahini Miso Chicken, Chicken Katsu in Curries, Miso Glazed Salmon with Kimchi Fried Rice, Bibimbap) — pages were needed so the This Week pool could link them; family names in the source .md notes rephrased generically.
- **Best-version pass (23/06/2026):** a free-improvements red-team and a best-version audit (named/primary sources) were applied across the book. 20 recipes upgraded (e.g. pressure-cooker bolognese, pizza dough fix, dry-brine + spatchcock roast chicken, sumac burger sauce, panko meatballs, vodka + rice-flour fish batter, Korean/Vietnamese trial refinements, seed-oil swaps); the previously-blank Fajitas page was researched and written. Reports + rationale in `meal-planner/notes/recipe-redteam-2026-06-23.html` and `recipe-best-version-audit-2026-06-23.html`. Owner overrides kept: Thai chicken keeps its veg, Norma keeps parmesan, shawarma keeps breast. Method: red-team (executed well?) then best-version audit (right recipe?), now the default for cookbook work.
- **Components rule (Douglas's):** a component gets its own page in `docs/components/` only if MULTIPLE recipes depend on it. Current three: BIR Mix Powder, Chicken Tikka, Homemade Chilli Powder. Single-recipe sub-parts stay inline; the BIR base stays in the BIR reference only.
- **Trials' meal-planner paperwork** (`.md` files, recipes-index, recipe-discovery registration) is deliberately deferred until first cook; see memory `recipe_critique_pending.md`.

## Imagery

- `docs/assets/*.webp` are bespoke gouache-style food illustrations (transparent, work on light + dark), generated 03/07/2026 via the Codex CLI image pipeline (memory `codex_game_art_pipeline`): generate on solid `#00ff00` with `codex exec` (FOREGROUND, background runs silently fail), strip with `remove_chroma_key.py --auto-key border --soft-matte --despill`, export WebP q82 at 720w (hero 1200w).
- **House style prompt (reuse verbatim for new images):** "Flat editorial gouache food illustration, warm palette of terracotta, burnt orange, ochre, deep teal, rose and sage green, confident visible brush strokes, clean crisp edges suitable for chroma-key cutout, no outlines, no text, no watermark, subject centred with generous margin, on a completely solid flat pure green #00ff00 background. Landscape 3:2."
- Content rules for artwork: illustrations must match the actual recipe (the pho is chicken pho, not beef); beef itself is fine (cooked in this house, e.g. bolognese). Illustrations get descriptive alt text.

## Weekly pool page (pool model since 11/07/2026)

- `docs/this-week.html` renders the week's POOL of dinners (no dates: the household cooks any pool meal any night). **No plan data lives in this repo**: the page fetches the pool from a secret gist (`gh gist view bea2fc791caba3d88676cd19f4b5c182`) and crosses off cooked meals live via the recipe-feedback endpoint (`?cooked=1&since=<week_of>`; ids come from Cooked-this submissions). Cooked-state fetch is best-effort: the pool renders even if the endpoint is down. Treat the feed as public: **meal names, generic tags and generic notes only - never day classes, calendar reasons, or family details.**
- The index masthead strip now shows "This week · N dinners in the pool" (was "Tonight: <meal>", retired with dates).
- Publishing a week: `python3 ~/.claude/scripts/publish_meal_plan.py [--week YYYY-MM-DD]` reads the week's `pool` from meal-planner's `meal-plan.json` and updates the gist. Apple Reminders sync was REMOVED the same day; this page is the household's only meal interface.

## Updating

- **Recipe changed/added in meal-planner** → ask Claude to add/update the matching page in `docs/recipes/` (follow an existing page as the template), add a card to `docs/index.html`, commit, push. Live in ~1 min.
- **BIR reference changed** → re-copy with the back link:
  `python3 -c "from pathlib import Path; src=Path.home()/'Projects/bir-curry-reference/index.html'; out=Path('docs/bir-curry-system.html'); h=src.read_text(); out.write_text(h.replace('<div class=\"wrap\">','<div class=\"wrap\">\n<p style=\"margin:0 0 14px\"><a href=\"index.html\" style=\"color:#b5471f;font-weight:600;text-decoration:none;font-size:.9rem\">&larr; All recipes</a></p>',1))"`

## Data notes

- The source-file defects found at launch (Norma's missing tomatoes, Pregnant Jools and Shawarma truncations) were fixed at source in meal-planner on 11/06/2026; site and sources now agree.
- Macaroni Cheese stays listed with a "retired" pill (dairy rule).
