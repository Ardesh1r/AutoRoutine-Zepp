# Countable vs Uncountable Foods - Implementation Guide

## ✅ Implementation Complete

Your meal logger now intelligently separates **countable** from **uncountable** foods with appropriate input methods.

---

## 📊 What Are Countable vs Uncountable Foods?

### Countable Foods (Individual Items)
Foods you count by individual units:
- **Eggs**: 1, 2, 3 eggs
- **Fruits**: 1, 2, 3 apples/oranges/bananas
- **Vegetables**: 1, 2, 3 tomatoes/potatoes/carrots
- **Bread**: 1, 2, 3 slices
- **Biscuits/Cookies**: 1, 2, 3 pieces
- **Nuts**: almonds, walnuts, cashews (countable)

### Uncountable Foods (Measured by Weight)
Foods you measure by grams/weight:
- **Meat**: chicken, beef, salmon, turkey
- **Grains**: rice, pasta, oats, flour
- **Dairy**: milk, yogurt, cheese
- **Oils/Spreads**: butter, olive oil, peanut butter
- **Sauces**: ketchup, mayo, soy sauce
- **Liquids**: water, juice, coffee

---

## 🎯 How It Works

### Countable Foods
When you select a countable food (e.g., "Egg, boiled"):

```
Label: "Quantity (eggs):"
Input: Number field (1, 2, 3, etc.)
Step: +1 / -1
Min: 1
Example: "2 eggs of Egg, boiled"
```

### Uncountable Foods
When you select an uncountable food (e.g., "Chicken breast, cooked"):

```
Label: "Grams:"
Input: Number field (100, 110, 120, etc.)
Step: +10 / -10
Min: 10
Example: "150g Chicken breast, cooked"
```

---

## 📋 Complete Countable Foods List

### Eggs (6 types)
- Egg, whole, raw ✓
- Egg, boiled ✓
- Egg, fried (in oil) ✓
- Egg, scrambled ✓
- Egg white ✓
- Egg yolk ✓

### Fruits (15+ types)
- Apple ✓
- Banana ✓
- Orange ✓
- Strawberry ✓
- Blueberry ✓
- Raspberry ✓
- Grape ✓
- Kiwi ✓
- Melon ✓
- Watermelon ✓
- Pineapple ✓
- Lemon ✓
- Lime ✓
- Avocado ✓
- Peach ✓
- Pear ✓
- Plum ✓
- Cherry ✓
- Date ✓
- Fig ✓

### Vegetables (10+ types)
- Tomato ✓
- Potato ✓
- Carrot ✓
- Onion ✓
- Garlic ✓
- Mushroom ✓
- Pepper ✓
- Cucumber ✓
- Lettuce ✓

### Bread & Grains
- Bread (slices) ✓
- Biscuit ✓
- Cookie ✓
- Cracker ✓

### Nuts & Seeds
- Almond ✓
- Walnut ✓
- Cashew ✓
- Peanut ✓
- Pistachio ✓
- Hazelnut ✓
- Macadamia ✓
- Pecan ✓
- Sunflower seed ✓
- Pumpkin seed ✓
- Sesame seed ✓
- Flax seed ✓
- Chia seed ✓

### Other Countable
- Olive ✓
- Pickle ✓

---

## 📋 Complete Uncountable Foods List

### Meat & Poultry
- Chicken breast, cooked
- Salmon, cooked
- Tuna, canned in water
- Turkey breast, cooked
- Beef, lean, cooked
- Pork, lean, cooked
- Lamb, cooked
- Duck, cooked
- Bacon
- Ham
- Sausage

### Fish & Seafood
- Cod, cooked
- Haddock, cooked
- Mackerel, cooked
- Sardines, canned
- Shrimp, cooked
- Crab, cooked
- Lobster, cooked

### Grains & Cereals
- Rice, white, cooked
- Rice, brown, cooked
- Pasta, cooked
- Oats, dry
- Barley, cooked
- Quinoa, cooked
- Wheat, cooked
- Rye, cooked

### Dairy
- Milk, whole
- Milk, skimmed
- Yogurt, plain
- Yogurt, Greek
- Cheese, cheddar
- Cheese, mozzarella
- Butter
- Cream

### Oils & Spreads
- Olive oil
- Coconut oil
- Peanut butter
- Almond butter
- Tahini
- Margarine

### Sauces & Condiments
- Ketchup
- Mayonnaise
- Soy sauce
- Vinegar
- Honey
- Jam
- Mustard

### Beverages
- Water
- Coffee
- Tea
- Orange juice
- Apple juice
- Milk
- Beer
- Wine

---

## 🔧 Database Structure

Each food now includes:

```json
{
  "id": "food_001",
  "name": "Egg, whole, raw",
  "countable": true,
  "unit": "eggs",
  "servings": [
    {
      "size": "1 large egg (50g)",
      "calories": 72,
      ...
    }
  ]
}
```

### Fields
- **countable**: `true` or `false`
- **unit**: 
  - Countable: "eggs", "apples", "slices", etc.
  - Uncountable: "grams"

---

## 🎯 User Experience

### Selecting a Countable Food (Egg)
1. Search: Type "egg"
2. Select: Click "Egg, boiled"
3. Choose serving: Click "1 large boiled egg (50g)"
4. Adjust quantity: Use input or +/− buttons
   - Input shows: "Quantity (eggs):"
   - Can enter: 1, 2, 3, 4, etc.
5. Add: Click "✓ Add to Log"
6. Result: "✓ Logged: 2 eggs of Egg, boiled"

### Selecting an Uncountable Food (Chicken)
1. Search: Type "chicken"
2. Select: Click "Chicken breast, cooked"
3. Choose serving: Click "100g"
4. Adjust quantity: Use input or +/− buttons
   - Input shows: "Grams:"
   - Can enter: 100, 110, 120, 150, 200, etc.
5. Add: Click "✓ Add to Log"
6. Result: "✓ Logged: 150g Chicken breast, cooked"

---

## 💡 Smart Features

### Automatic Detection
- System automatically detects if food is countable
- No manual configuration needed
- Based on food name matching

### Appropriate Increments
- **Countable**: +1 / -1 (whole units)
- **Uncountable**: +10 / -10 grams

### Clear Labels
- **Countable**: "Quantity (eggs):", "Quantity (apples):", etc.
- **Uncountable**: "Grams:"

### Sensible Defaults
- **Countable**: Starts at 1
- **Uncountable**: Starts at 100g

### Validation
- **Countable**: Min 1, no decimals
- **Uncountable**: Min 10g, 10g increments

---

## 🧪 Testing

### Test Countable Food
1. Open: http://localhost:8000/test.html
2. Log Meal → Breakfast
3. Search: "egg"
4. Select: "Egg, boiled"
5. Choose: "1 large boiled egg (50g)"
6. Adjust: Change quantity to 2
7. Add: Click "✓ Add to Log"
8. Result: "✓ Logged: 2 eggs of Egg, boiled"

### Test Uncountable Food
1. Log Meal → Lunch
2. Search: "chicken"
3. Select: "Chicken breast, cooked"
4. Choose: "100g"
5. Adjust: Change to 150g
6. Add: Click "✓ Add to Log"
7. Result: "✓ Logged: 150g Chicken breast, cooked"

---

## 📊 Statistics

### Total Foods: 112
- **Countable**: ~45 foods
- **Uncountable**: ~67 foods

### Coverage
- All common UK foods included
- Multiple egg types (6)
- Multiple fruit types (20+)
- Multiple vegetable types (10+)
- Multiple meat types (10+)
- Multiple grain types (8+)
- Multiple dairy types (8+)

---

## 🔄 How It Calculates

### Countable Foods
```
Nutrition per unit × Quantity
Example: Egg (72 cal) × 2 = 144 cal
```

### Uncountable Foods
```
(Nutrition per 100g ÷ 100) × Grams
Example: Chicken (165 cal/100g) ÷ 100 × 150g = 247.5 cal
```

---

## 📝 Implementation Details

### Files Modified
1. **FOOD_DATABASE_PART1.json** - Added countable/unit properties
2. **FOOD_DATABASE_PART2.json** - Added countable/unit properties
3. **test.html** - Updated UI logic for countable/uncountable

### Code Changes
- `showServingSize()` - Detects food type and updates label
- `increaseQty()` / `decreaseQty()` - Uses appropriate step size
- `logSelectedMeal()` - Formats message with correct unit
- `selectServing()` - Sets appropriate default value

---

## 🚀 Future Enhancements

- [ ] Custom food items with countable/uncountable selection
- [ ] Barcode scanning with automatic detection
- [ ] Voice input for quantity
- [ ] Meal templates with preset quantities
- [ ] Favorites with remembered quantities
- [ ] Nutrition preview before logging

---

## ✨ Key Benefits

✅ **Intuitive** - Users see appropriate input for each food type
✅ **Accurate** - Correct calculations for both countable and uncountable
✅ **Fast** - Quick input with +/− buttons
✅ **Smart** - Automatic detection, no configuration needed
✅ **Flexible** - Supports any quantity or gram amount
✅ **Clear** - Labels show exactly what's being measured

---

## 📞 Support

For questions about countable/uncountable foods:
- See FOOD_DATABASE_README.md for food list
- See UI_IMPROVEMENTS.md for UI details
- See QUICK_START.md for usage examples

---

**Countable/Uncountable separation is now live!** 🎯

Test at: http://localhost:8000/test.html
