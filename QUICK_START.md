# Quick Start - Meal Logging System

## Files

- **FOOD_DATABASE_PART1.json** - 50 foods (eggs, proteins, vegetables, fruits, drinks)
- **FOOD_DATABASE_PART2.json** - 50 foods (grains, nuts, dairy, beverages)
- **MEAL_LOGGER.js** - Core logging class
- **UK_DIETARY_GUIDELINES.json** - UK recommended daily intake

## Initialize

```javascript
const part1 = require('./FOOD_DATABASE_PART1.json');
const part2 = require('./FOOD_DATABASE_PART2.json');
const guidelines = require('./UK_DIETARY_GUIDELINES.json');
const MealLogger = require('./MEAL_LOGGER.js');

const logger = new MealLogger(part1, part2);
logger.setUserProfile('male', 30, 'moderate');
```

## Log Meals

```javascript
// Breakfast: 2 eggs + toast
logger.logMeal('food_001', '2 large eggs (100g)', 'breakfast', '07:30');
logger.logMeal('food_014', '1 slice (30g)', 'breakfast', '07:30');

// Lunch: Chicken + rice
logger.logMeal('food_005', '150g', 'lunch', '12:30');
logger.logMeal('food_016', '100g', 'lunch', '12:30');

// Snack: Apple + peanut butter
logger.logMeal('food_021', '1 medium (182g)', 'snacks', '15:30');
logger.logMeal('food_031', '1 tablespoon (16g)', 'snacks', '15:30');

// Drink: Beer
logger.logMeal('drink_001', '1 pint (568ml)', 'drinks', '19:00');
```

## Get Daily Summary

```javascript
const summary = logger.getDailySummary(null, guidelines);

console.log(summary);
// Output:
// {
//   date: "2026-04-26",
//   meals: [...],
//   summary: {
//     totalCalories: 1580,
//     totalProtein: 68,
//     totalCarbs: 165,
//     totalFat: 52,
//     totalSugar: 15,
//     totalFiber: 12,
//     totalUnits: 2.3
//   },
//   comparison: {
//     calories: {
//       consumed: 1580,
//       recommended: 2500,
//       remaining: 920,
//       percentage: 63,
//       status: "under"
//     },
//     protein: { ... },
//     carbs: { ... },
//     ...
//   },
//   insights: [
//     "You have 920 calories remaining.",
//     "Protein is 124% of goal. On-track!",
//     ...
//   ]
// }
```

## Find Foods

```javascript
// Search by name
const eggs = logger.getFoodsByName('egg');
console.log(eggs);
// Output: [
//   { id: 'food_001', name: 'Egg, whole, raw', servings: [...] },
//   { id: 'food_002', name: 'Egg, boiled', servings: [...] },
//   ...
// ]

// Get all foods
const allFoods = logger.getAllFoods();
console.log(allFoods.length); // 100
```

## Remove Meal

```javascript
const result = logger.removeMeal('meal_1714156200000');
// Output: { success: true, removed: {...}, dailySummary: {...} }
```

## Get Meals for Date

```javascript
const meals = logger.getMealsForDate('2026-04-26');
console.log(meals);
// Output: { date: '2026-04-26', meals: [...], summary: {...} }
```

## Export Log

```javascript
const json = logger.exportDailyLog();
console.log(json); // JSON string of today's log
```

## Clear Log

```javascript
logger.clearDailyLog();
// Output: { success: true, message: 'Cleared log for 2026-04-26' }
```

## Food IDs Reference

### Eggs (food_001 - food_004)
- food_001: Egg, whole, raw
- food_002: Egg, boiled
- food_003: Egg, fried
- food_004: Egg, scrambled

### Proteins (food_005 - food_010)
- food_005: Chicken breast, cooked
- food_006: Salmon, cooked
- food_007: Tuna, canned
- food_008: Beef, lean, cooked
- food_009: Pork, lean, cooked
- food_010: Turkey breast, cooked

### Vegetables (food_024 - food_029)
- food_024: Broccoli, cooked
- food_025: Carrot, cooked
- food_026: Tomato, fresh
- food_027: Lettuce, iceberg
- food_028: Spinach, raw
- food_029: Sweet potato, cooked

### Fruits (food_020 - food_023)
- food_020: Banana
- food_021: Apple
- food_022: Orange
- food_023: Strawberry

### Drinks (drink_001 - drink_020)
- drink_001: Beer, lager (4% ABV)
- drink_002: Wine, red (12% ABV)
- drink_003: Wine, white (11% ABV)
- drink_004: Spirits, vodka (40% ABV)
- drink_005: Water
- drink_006: Coffee, black
- drink_007: Tea, black
- drink_008: Orange juice
- drink_009: Apple juice
- drink_010: Soft drink, cola

**See FOOD_DATABASE_README.md for complete food list**

## Daily Intake Targets (Adult Male, 19-50)

| Nutrient | Target | Status |
|----------|--------|--------|
| Calories | 2,500 | |
| Protein | 55g | |
| Carbs | 300g | |
| Fat | 95g | |
| Saturated Fat | 30g | |
| Sugar | 50g | |
| Fiber | 30g | |
| Salt | 6g | |
| Alcohol | 14 units/week | |

## Status Indicators

- **under** - Less than 90% of target
- **on-track** - 90-110% of target
- **over** - More than 110% of target

## Warnings

- **Sugar** - Over 50g per day
- **Salt** - Over 6g per day
- **Saturated Fat** - Over 30g per day
- **Alcohol** - Over 14 units per week (binge drinking: 8+ units in one session)

---

**All data from USDA FoodData Central & NHS Guidelines**
