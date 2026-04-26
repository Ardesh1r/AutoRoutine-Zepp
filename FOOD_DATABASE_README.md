# Food Database - 100 Foods

## Overview

Complete food database with **100 foods** from USDA FoodData Central. No categories - foods can be used in any meal. All data sourced from reliable government database.

## Files

- **FOOD_DATABASE_PART1.json** - Foods 1-50 (eggs, proteins, vegetables, fruits, drinks)
- **FOOD_DATABASE_PART2.json** - Foods 51-100 (grains, nuts, dairy, beverages)

## Data Source

**USDA FoodData Central** (https://fdc.nal.usda.gov/)
- Official US government nutrition database
- Peer-reviewed data
- 400,000+ foods
- Most reliable source

## Food Categories Included

### Eggs (6 types)
- Whole raw, boiled, fried, scrambled, white, yolk

### Proteins (10)
- Chicken breast, salmon, tuna, beef, pork, turkey, tofu, tempeh, lentils, chickpeas

### Dairy (10)
- Milk (whole, semi-skimmed, skimmed), yoghurt, Greek yoghurt, cheeses (cheddar, mozzarella, feta, ricotta, cottage)

### Grains & Carbs (10)
- Rice (white, brown), pasta (regular, wholemeal), oats, bread (white, wholemeal), couscous, quinoa, barley

### Vegetables (10)
- Broccoli, carrot, tomato, lettuce, spinach, sweet potato, potato, cucumber, bell pepper, onion

### Fruits (15)
- Banana, apple, orange, strawberry, blueberry, raspberry, blackberry, grape, mango, pineapple, kiwi, peach, pear, watermelon, melon

### Nuts & Seeds (8)
- Almonds, walnuts, cashews, pumpkin seeds, sunflower seeds, peanut butter

### Oils & Fats (4)
- Olive oil, butter, coconut oil, honey

### Snacks (8)
- Dark chocolate, crisps, digestive biscuits, granola, muesli, granola bars, cereal bars, protein bars

### Drinks (20)
- Beer (lager, IPA), wine (red, white), spirits (vodka, gin, whiskey, rum, brandy), cocktails, cider, prosecco
- Water, coffee, tea, juices (orange, apple)
- Soft drinks (cola, diet cola)
- Smoothies (berry, banana), protein shake, energy drink, sports drink
- Milk alternatives (almond, oat, soy, coconut)

## Data Structure

Each food has:
```json
{
  "id": "food_001",
  "name": "Egg, whole, raw",
  "servings": [
    {
      "size": "1 large egg (50g)",
      "default": true,
      "calories": 72,
      "protein": 6.3,
      "carbs": 0.4,
      "fat": 5.0,
      "saturatedFat": 1.6,
      "sugar": 0.4,
      "fiber": 0,
      "salt": 0.07
    }
  ]
}
```

## Nutrition Fields

- **calories** - Energy (kcal)
- **protein** - Grams
- **carbs** - Grams
- **fat** - Total fat (grams)
- **saturatedFat** - Saturated fat (grams)
- **sugar** - Grams (free sugars)
- **fiber** - Grams
- **salt** - Grams (sodium converted)
- **alcohol** - Grams (drinks only)
- **units** - Alcohol units (drinks only)

## Serving Sizes

Each food has multiple serving options:
- **default: true** - Pre-selected serving size
- **default: false** - Alternative serving sizes

Example:
```json
"servings": [
  {
    "size": "1 large egg (50g)",
    "default": true,
    "calories": 72,
    ...
  },
  {
    "size": "2 large eggs (100g)",
    "default": false,
    "calories": 144,
    ...
  }
]
```

## How to Use

### 1. Merge Files (Optional)

Combine both parts into single file:

```javascript
const part1 = require('./FOOD_DATABASE_PART1.json');
const part2 = require('./FOOD_DATABASE_PART2.json');

const combined = {
  ...part1,
  foods: {
    ...part1.foods,
    ...part2.foods
  }
};

// Save as FOOD_DATABASE.json
```

### 2. Load in App

```javascript
const foodDatabase = require('./FOOD_DATABASE_PART1.json');
const foodDatabase2 = require('./FOOD_DATABASE_PART2.json');

// Merge foods
const allFoods = {
  ...foodDatabase.foods,
  ...foodDatabase2.foods
};
```

### 3. Find Food by ID

```javascript
function findFood(foodId) {
  for (const food of Object.values(allFoods)) {
    if (food.id === foodId) {
      return food;
    }
  }
  return null;
}

const egg = findFood('food_001');
```

### 4. Get Food Servings

```javascript
const food = findFood('food_001');
const servings = food.servings;

// Get default serving
const defaultServing = servings.find(s => s.default);

// Get all serving options
servings.forEach(serving => {
  console.log(`${serving.size}: ${serving.calories} cal`);
});
```

### 5. Log a Meal

```javascript
function logMeal(foodId, servingSize) {
  const food = findFood(foodId);
  const serving = food.servings.find(s => s.size === servingSize);
  
  return {
    foodName: food.name,
    serving: serving.size,
    calories: serving.calories,
    protein: serving.protein,
    carbs: serving.carbs,
    fat: serving.fat,
    sugar: serving.sugar,
    fiber: serving.fiber
  };
}

// Log 2 eggs
const meal = logMeal('food_001', '2 large eggs (100g)');
```

## Key Features

✅ **100 Foods** - Comprehensive coverage
✅ **No Categories** - Eggs can be breakfast, lunch, dinner, or snack
✅ **Multiple Servings** - Each food has 1-3 serving options
✅ **Default Servings** - Pre-selected for quick logging
✅ **USDA Data** - Peer-reviewed, reliable nutrition data
✅ **Complete Nutrition** - Calories, macros, fiber, salt, alcohol units
✅ **UK Foods** - Common UK foods (Tesco, supermarket items)
✅ **Alcohol Tracking** - Beer, wine, spirits with units
✅ **Lightweight** - JSON format, no dependencies

## Attribution

```
All nutrition data sourced from USDA FoodData Central
https://fdc.nal.usda.gov/
```

## Usage in Watch App

```javascript
// Initialize
const logger = new MealLogger(foodDatabase);

// Log breakfast
logger.logMeal('food_001', '2 large eggs (100g)', 'breakfast', '07:30');
logger.logMeal('food_014', '1 slice (30g)', 'breakfast', '07:30');

// Log lunch
logger.logMeal('food_005', '150g', 'lunch', '12:30');
logger.logMeal('food_016', '100g', 'lunch', '12:30');

// Log drink
logger.logMeal('drink_001', '1 pint (568ml)', 'drinks', '19:00');

// Get daily summary
const summary = logger.getDailySummary();
```

## Next Steps

1. Merge PART1 and PART2 into single FOOD_DATABASE.json
2. Create MEAL_LOGGER.js with calculation logic
3. Create UK_DIETARY_GUIDELINES.json with recommended intake
4. Build watch UI for food selection
5. Implement daily summary display

---

**All data from USDA FoodData Central - Peer-reviewed, reliable source**
