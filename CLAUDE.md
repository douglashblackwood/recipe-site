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
- `docs/bir-curry-system.html` is a copy of `bir-curry-reference/index.html` with a back link injected after `<div class="wrap">`.

## Current state (11/06/2026)

- **29 recipes + 3 components + the BIR reference.** Frittata (feta rejected) and Parmesan Crumbed Fish removed; 6 Korean/Vietnamese trial recipes added (green "trial" pills), Jalfrezi + Saag Balti converged onto the BIR system, pizza upgraded (cold ferment, pizza oven).
- **Components rule (Douglas's):** a component gets its own page in `docs/components/` only if MULTIPLE recipes depend on it. Current three: BIR Mix Powder, Chicken Tikka, Homemade Chilli Powder. Single-recipe sub-parts stay inline; the BIR base stays in the BIR reference only.
- **Trials' meal-planner paperwork** (`.md` files, recipes-index, recipe-discovery registration) is deliberately deferred until first cook; see memory `recipe_critique_pending.md`.

## Updating

- **Recipe changed/added in meal-planner** → ask Claude to add/update the matching page in `docs/recipes/` (follow an existing page as the template), add a card to `docs/index.html`, commit, push. Live in ~1 min.
- **BIR reference changed** → re-copy with the back link:
  `python3 -c "from pathlib import Path; src=Path.home()/'Projects/bir-curry-reference/index.html'; out=Path('docs/bir-curry-system.html'); h=src.read_text(); out.write_text(h.replace('<div class=\"wrap\">','<div class=\"wrap\">\n<p style=\"margin:0 0 14px\"><a href=\"index.html\" style=\"color:#b5471f;font-weight:600;text-decoration:none;font-size:.9rem\">&larr; All recipes</a></p>',1))"`

## Data notes

- The source-file defects found at launch (Norma's missing tomatoes, Pregnant Jools and Shawarma truncations) were fixed at source in meal-planner on 11/06/2026; site and sources now agree.
- Macaroni Cheese stays listed with a "retired" pill (dairy rule).
