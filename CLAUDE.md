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
- **Design refresh (03/07/2026):** light + dark palettes via `prefers-color-scheme` (auto, no toggle); index grouped into sections (Curries with the BIR hero, Everyday Mains, Pasta, Fish & Seafood, Korean & Vietnamese, Project Cooks, Components) with the filter JS hiding empty sections; cards get a category-colour wash + hover lift; recipe meta pills are now a hairline strip (CSS-only, same HTML); every recipe/component page has a fixed "Cook mode" button (bigger step/ingredient type + screen wake-lock, wake-lock needs HTTPS so it works live but not on file://); print stylesheet included. New recipe pages must include the cookbtn button + its script block (copy from any existing page).
- `docs/bir-curry-system.html` is a copy of `bir-curry-reference/index.html` with a back link injected after `<div class="wrap">`.

## Current state (23/06/2026)

- **29 recipes + 3 components + the BIR reference.** Frittata (feta rejected) and Parmesan Crumbed Fish removed; 6 Korean/Vietnamese trial recipes added (green "trial" pills), Jalfrezi + Saag Balti converged onto the BIR system, pizza upgraded (cold ferment, pizza oven).
- **Best-version pass (23/06/2026):** a free-improvements red-team and a best-version audit (named/primary sources) were applied across the book. 20 recipes upgraded (e.g. pressure-cooker bolognese, pizza dough fix, dry-brine + spatchcock roast chicken, sumac burger sauce, panko meatballs, vodka + rice-flour fish batter, Korean/Vietnamese trial refinements, seed-oil swaps); the previously-blank Fajitas page was researched and written. Reports + rationale in `meal-planner/notes/recipe-redteam-2026-06-23.html` and `recipe-best-version-audit-2026-06-23.html`. Owner overrides kept: Thai chicken keeps its veg, Norma keeps parmesan, shawarma keeps breast. Method: red-team (executed well?) then best-version audit (right recipe?), now the default for cookbook work.
- **Components rule (Douglas's):** a component gets its own page in `docs/components/` only if MULTIPLE recipes depend on it. Current three: BIR Mix Powder, Chicken Tikka, Homemade Chilli Powder. Single-recipe sub-parts stay inline; the BIR base stays in the BIR reference only.
- **Trials' meal-planner paperwork** (`.md` files, recipes-index, recipe-discovery registration) is deliberately deferred until first cook; see memory `recipe_critique_pending.md`.

## Weekly plan page

- `docs/this-week.html` renders the week's dinner plan. **No plan data lives in this repo**: the page fetches JSON at load from a secret gist (`gh gist view bea2fc791caba3d88676cd19f4b5c182`), keeping the public repo clean per the personal-data rule. Note the gist raw URL is visible in the page source, so treat the feed itself as public: **meal names and dates only, never notes, day_class reasons, or family details.**
- Publishing a week: `python3 ~/.claude/scripts/publish_meal_plan.py [--week YYYY-MM-DD]` reads meal-planner's `meal-plan.json`, strips everything but date + planned meal, resolves recipe-page links, and updates the gist. Run it whenever a new weekly plan is generated. The Apple Reminders sync in meal-planner is unchanged and runs in parallel.

## Updating

- **Recipe changed/added in meal-planner** → ask Claude to add/update the matching page in `docs/recipes/` (follow an existing page as the template), add a card to `docs/index.html`, commit, push. Live in ~1 min.
- **BIR reference changed** → re-copy with the back link:
  `python3 -c "from pathlib import Path; src=Path.home()/'Projects/bir-curry-reference/index.html'; out=Path('docs/bir-curry-system.html'); h=src.read_text(); out.write_text(h.replace('<div class=\"wrap\">','<div class=\"wrap\">\n<p style=\"margin:0 0 14px\"><a href=\"index.html\" style=\"color:#b5471f;font-weight:600;text-decoration:none;font-size:.9rem\">&larr; All recipes</a></p>',1))"`

## Data notes

- The source-file defects found at launch (Norma's missing tomatoes, Pregnant Jools and Shawarma truncations) were fixed at source in meal-planner on 11/06/2026; site and sources now agree.
- Macaroni Cheese stays listed with a "retired" pill (dairy rule).
