import { recipes } from '../data/recipes';

// Turn a meal plan into a grocery list by matching each meal entry to a recipe in
// recipes.js and aggregating its ingredients (with per-item counts). Meal names
// that don't match any recipe fall through to a plain "Other items" list.

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

// Split a meal string like "Moong Cheela x3" / "Poha + Peanuts" / "Aloo Paratha (no ghee)"
// into candidate dish tokens: drop parentheticals and xN multiplicities, split on +, &, comma.
function tokensFromMeal(meal) {
  return meal
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/\bx\d+\b/g, '')
    .split(/[+&,]/)
    .map(normalize)
    .filter(Boolean);
}

// Score how well a meal token matches a recipe title (0 = no match).
function matchRecipe(token, titleNorm) {
  // Tier 1: containment — "rajma rice" inside "rajma rice bowl"; single words like
  // "poha" inside "peanut poha".
  if (titleNorm.includes(token)) return 1;
  if (token.includes(titleNorm) && titleNorm.split(' ').length > 1) return 0.9;
  // Tier 2: word overlap for multi-word tokens ("moong cheela" vs "moong dal cheela" → 2/2).
  const tw = token.split(' ');
  const tws = new Set(tw);
  const shared = titleNorm.split(' ').filter((w) => tws.has(w)).length;
  return shared >= 1 && tw.length >= 2 && shared / tw.length >= 0.5 ? shared / tw.length : 0;
}

export function buildGroceryList(plan) {
  const ingredientMap = new Map(); // normalized ingredient -> { text, count, from }
  const plainItems = new Set(); // unmatched meal names -> plain grocery lines
  const meals = plan.days.flatMap((d) => [d.breakfast, d.lunch, d.dinner, d.snacks]);

  for (const meal of meals) {
    const tokens = tokensFromMeal(meal);
    let matched = false;
    for (const token of tokens) {
      let best = null;
      let bestScore = 0;
      for (const r of recipes) {
        const s = matchRecipe(token, normalize(r.title));
        if (s > bestScore) {
          bestScore = s;
          best = r;
        }
      }
      if (best && bestScore > 0) {
        matched = true;
        for (const ing of best.ingredients) {
          const key = normalize(ing);
          const prev = ingredientMap.get(key);
          ingredientMap.set(key, prev
            ? { ...prev, count: prev.count + 1 }
            : { text: ing, count: 1, from: best.title });
        }
      }
    }
    if (!matched) plainItems.add(meal);
  }

  return {
    ingredients: [...ingredientMap.values()].sort((a, b) => b.count - a.count),
    plainItems: [...plainItems],
    recipeCount: ingredientMap.size,
  };
}

// Return the best-matching recipe for a meal-plan string (e.g. "Rajma Rice" → the
// Rajma Rice Bowl recipe), or null if nothing matches. Used by Planner to show a
// dish thumbnail per meal row.
export function findRecipeForMeal(meal) {
  if (!meal) return null;
  let best = null;
  let bestScore = 0;
  for (const token of tokensFromMeal(meal)) {
    for (const r of recipes) {
      const s = matchRecipe(token, normalize(r.title));
      if (s > bestScore) {
        bestScore = s;
        best = r;
      }
    }
  }
  return bestScore > 0 ? best : null;
}
