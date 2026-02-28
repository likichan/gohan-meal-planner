import { FavoriteMeal, Meal, WeeklyPlan } from './types';

const WEEKLY_PLAN_KEY = 'meal-planner-weekly-plan';
const FAVORITES_KEY = 'meal-planner-favorites';

export function saveWeeklyPlan(plan: WeeklyPlan): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WEEKLY_PLAN_KEY, JSON.stringify(plan));
}

export function loadWeeklyPlan(): WeeklyPlan | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(WEEKLY_PLAN_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as WeeklyPlan;
  } catch {
    return null;
  }
}

export function saveFavorite(meal: Meal): void {
  if (typeof window === 'undefined') return;
  const favorites = loadFavorites();
  const alreadySaved = favorites.some((f) => f.id === meal.id);
  if (alreadySaved) return;
  const newFavorite: FavoriteMeal = {
    id: meal.id,
    meal,
    savedAt: new Date().toISOString(),
  };
  favorites.push(newFavorite);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function removeFavorite(mealId: string): void {
  if (typeof window === 'undefined') return;
  const favorites = loadFavorites().filter((f) => f.id !== mealId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function loadFavorites(): FavoriteMeal[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(FAVORITES_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as FavoriteMeal[];
  } catch {
    return [];
  }
}

export function isFavorite(mealId: string): boolean {
  return loadFavorites().some((f) => f.id === mealId);
}
