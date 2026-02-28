export interface Ingredient {
  name: string;
  amount: string;
}

export interface Meal {
  id: string;
  day: string;
  dayIndex: number;
  name: string;
  description: string;
  cookingTime: number;
  calories: number;
  tags: string[];
  ingredients: Ingredient[];
  steps: string[];
}

export interface ShoppingItem {
  name: string;
  amount: string;
  category: string;
  usedOnDays: string[];
  storageMethod: string;
  storageNote: string;
}

export interface WeeklyPlan {
  weekOf: string;
  meals: Meal[];
  shoppingList: ShoppingItem[];
}

export interface FavoriteMeal {
  id: string;
  meal: Meal;
  savedAt: string;
}
