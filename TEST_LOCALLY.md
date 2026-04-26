# Test Meal Logger Locally - Browser & Amazfit Bip 6

Since Zepp CLI setup is complex, here's a direct approach to test your meal logger.

## 🌐 Test in Browser First

### Option 1: Simple HTML Test Page

Create a test file to verify the meal logger works:

```bash
cat > /Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp/test.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Meal Logger Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 480px;
            margin: 0 auto;
            padding: 20px;
            background: #1a1a1a;
            color: #fff;
        }
        .screen {
            display: none;
            padding: 20px;
            border: 1px solid #444;
            border-radius: 8px;
            margin: 10px 0;
        }
        .screen.active {
            display: block;
        }
        button {
            width: 100%;
            padding: 15px;
            margin: 5px 0;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background: #0052a3;
        }
        h1 { text-align: center; }
        .summary {
            background: #222;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .stat {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #333;
        }
        .stat:last-child {
            border-bottom: none;
        }
        .success { color: #00ff00; }
        .warning { color: #ffaa00; }
        .error { color: #ff0000; }
    </style>
</head>
<body>
    <!-- Main Screen -->
    <div id="main" class="screen active">
        <h1>🍽️ Meal Logger</h1>
        <button onclick="showScreen('summary')">View Daily Summary</button>
        <button onclick="showScreen('mealType')">Log Meal</button>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #444;">
        <h3>Quick Log</h3>
        <button onclick="quickLog('food_001', '1 large egg (50g)')">🥚 Egg</button>
        <button onclick="quickLog('food_021', '1 medium (182g)')">🍎 Apple</button>
        <button onclick="quickLog('food_005', '100g')">🍗 Chicken</button>
        <button onclick="quickLog('drink_005', '250ml glass')">💧 Water</button>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #444;">
        <button onclick="showScreen('settings')">⚙️ Settings</button>
    </div>

    <!-- Meal Type Selection -->
    <div id="mealType" class="screen">
        <h1>Select Meal Type</h1>
        <button onclick="selectMealType('breakfast')">☀️ Breakfast</button>
        <button onclick="selectMealType('lunch')">🌤️ Lunch</button>
        <button onclick="selectMealType('dinner')">🌙 Dinner</button>
        <button onclick="selectMealType('snacks')">🍿 Snack</button>
        <button onclick="selectMealType('drinks')">🍺 Drink</button>
        <button onclick="showScreen('main')">← Back</button>
    </div>

    <!-- Food Selection -->
    <div id="foodList" class="screen">
        <h1>Select Food</h1>
        <div id="foodListContent"></div>
        <button onclick="showScreen('mealType')">← Back</button>
    </div>

    <!-- Serving Size -->
    <div id="servingSize" class="screen">
        <h1 id="servingTitle">Select Serving</h1>
        <div id="servingContent"></div>
        <button onclick="showScreen('foodList')">← Back</button>
    </div>

    <!-- Daily Summary -->
    <div id="summary" class="screen">
        <h1>Daily Summary</h1>
        <div id="summaryContent" class="summary"></div>
        <button onclick="showScreen('main')">← Back</button>
    </div>

    <!-- Settings -->
    <div id="settings" class="screen">
        <h1>Settings</h1>
        <div class="summary">
            <h3>User Profile</h3>
            <div class="stat">
                <span>Gender:</span>
                <span>Male</span>
            </div>
            <div class="stat">
                <span>Age:</span>
                <span>30</span>
            </div>
            <div class="stat">
                <span>Activity:</span>
                <span>Moderate</span>
            </div>
        </div>
        <button onclick="clearLog()">Clear Today's Log</button>
        <button onclick="showScreen('main')">← Back</button>
    </div>

    <script>
        // Load food databases
        let foods = {};
        let guidelines = {};
        let mealLogger = null;
        let selectedMealType = null;
        let selectedFood = null;

        // Initialize
        async function init() {
            try {
                // Load food databases
                const part1Response = await fetch('FOOD_DATABASE_PART1.json');
                const part1 = await part1Response.json();
                
                const part2Response = await fetch('FOOD_DATABASE_PART2.json');
                const part2 = await part2Response.json();
                
                const guidelinesResponse = await fetch('UK_DIETARY_GUIDELINES.json');
                guidelines = await guidelinesResponse.json();
                
                // Combine foods
                foods = { ...part1.foods, ...part2.foods };
                
                // Initialize meal logger
                mealLogger = new MealLogger(part1, part2);
                mealLogger.setUserProfile('male', 30, 'moderate');
                
                console.log('✓ Meal Logger initialized');
                console.log('✓ Foods loaded:', Object.keys(foods).length);
                console.log('✓ Guidelines loaded');
                
                showScreen('main');
            } catch (error) {
                console.error('Error initializing:', error);
                alert('Error loading meal logger: ' + error.message);
            }
        }

        // Show screen
        function showScreen(screenId) {
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById(screenId).classList.add('active');
        }

        // Select meal type
        function selectMealType(type) {
            selectedMealType = type;
            showFoodList();
        }

        // Show food list
        function showFoodList() {
            const foodList = Object.values(foods);
            let html = '<div style="max-height: 300px; overflow-y: auto;">';
            
            foodList.forEach((food, index) => {
                html += `<button onclick="selectFood(${index})" style="margin: 5px 0; text-align: left;">${food.name}</button>`;
            });
            
            html += '</div>';
            document.getElementById('foodListContent').innerHTML = html;
            showScreen('foodList');
        }

        // Select food
        function selectFood(index) {
            selectedFood = Object.values(foods)[index];
            showServingSize();
        }

        // Show serving size
        function showServingSize() {
            document.getElementById('servingTitle').textContent = selectedFood.name;
            let html = '';
            
            selectedFood.servings.forEach((serving, index) => {
                html += `<button onclick="logMeal(${index})" style="text-align: left;">
                    ${serving.size}<br>
                    <small>${serving.calories} cal</small>
                </button>`;
            });
            
            document.getElementById('servingContent').innerHTML = html;
            showScreen('servingSize');
        }

        // Log meal
        function logMeal(servingIndex) {
            try {
                const serving = selectedFood.servings[servingIndex];
                const result = mealLogger.logMeal(
                    selectedFood.id,
                    serving.size,
                    selectedMealType
                );
                
                if (result.success) {
                    alert('✓ Logged: ' + selectedFood.name);
                    showScreen('main');
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                alert('Error logging meal: ' + error.message);
            }
        }

        // Quick log
        function quickLog(foodId, servingSize) {
            try {
                const food = Object.values(foods).find(f => f.id === foodId);
                if (!food) {
                    alert('Food not found');
                    return;
                }
                
                const result = mealLogger.logMeal(foodId, servingSize, 'snacks');
                
                if (result.success) {
                    alert('✓ Logged: ' + food.name);
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }

        // Show daily summary
        function showSummary() {
            const summary = mealLogger.getDailySummary(null, guidelines);
            const comp = summary.comparison;
            
            let html = `
                <div class="stat">
                    <span>Calories</span>
                    <span>${comp.calories.consumed}/${comp.calories.recommended}</span>
                </div>
                <div class="stat">
                    <span>Protein</span>
                    <span>${comp.protein.consumed}/${comp.protein.recommended}g</span>
                </div>
                <div class="stat">
                    <span>Carbs</span>
                    <span>${comp.carbs.consumed}/${comp.carbs.recommended}g</span>
                </div>
                <div class="stat">
                    <span>Fat</span>
                    <span>${comp.fat.consumed}/${comp.fat.recommended}g</span>
                </div>
                <div class="stat">
                    <span>Sugar</span>
                    <span>${comp.sugar.consumed}/${comp.sugar.recommended}g</span>
                </div>
                <div class="stat">
                    <span>Fiber</span>
                    <span>${comp.fiber.consumed}/${comp.fiber.recommended}g</span>
                </div>
                <div class="stat">
                    <span>Alcohol</span>
                    <span>${comp.alcohol.consumed}/${comp.alcohol.recommended} units</span>
                </div>
                <div class="stat" style="margin-top: 10px; font-weight: bold;">
                    <span>Remaining</span>
                    <span>${comp.calories.remaining} cal</span>
                </div>
            `;
            
            document.getElementById('summaryContent').innerHTML = html;
        }

        // Clear log
        function clearLog() {
            if (confirm('Clear today\'s log?')) {
                mealLogger.clearDailyLog();
                alert('✓ Log cleared');
                showScreen('main');
            }
        }

        // Override showScreen to update summary
        const originalShowScreen = showScreen;
        showScreen = function(screenId) {
            if (screenId === 'summary') {
                showSummary();
            }
            originalShowScreen(screenId);
        };

        // Load MealLogger class
        const script = document.createElement('script');
        script.src = 'MEAL_LOGGER.js';
        script.onload = init;
        document.head.appendChild(script);
    </script>
</body>
</html>
EOF
```

### Run Test Page

```bash
cd /Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp

# Start a simple HTTP server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000/test.html
```

**Test in browser:**
- ✓ Log meals
- ✓ View daily summary
- ✓ Quick log buttons
- ✓ Settings
- ✓ Clear log

---

## ⌚ Deploy to Amazfit Bip 6

### Step 1: Install Zepp CLI (Correct Package)

```bash
npm install -g @zeppos/zeus-cli
```

### Step 2: Verify Installation

```bash
zeus --version
```

### Step 3: Build App

```bash
cd /Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp
zeus build
```

### Step 4: Connect Amazfit Bip 6

1. **Enable Developer Mode on Watch**
   ```
   Settings → About → Tap version 10 times
   ```

2. **Connect via USB or WiFi**
   - USB cable to computer
   - Or WiFi (if supported)

3. **Zepp App on Phone**
   - Download from App Store/Google Play
   - Pair watch with phone

### Step 5: Deploy to Watch

```bash
zeus preview --device
```

### Step 6: Test on Watch

1. Open app: Apps → AutoRoutine → Meal Logger
2. Log a meal
3. View daily summary
4. Test quick log buttons

---

## 🧪 Testing Checklist

### Browser Test
- [ ] Page loads
- [ ] Can select meal type
- [ ] Can select food
- [ ] Can select serving size
- [ ] Can log meal
- [ ] Daily summary shows values
- [ ] Quick log works
- [ ] Clear log works
- [ ] No console errors

### Watch Test (Bip 6)
- [ ] App deploys successfully
- [ ] App launches on watch
- [ ] Can navigate screens
- [ ] Can log a meal
- [ ] Daily summary calculates
- [ ] Response time is fast
- [ ] No crashes

---

## 🔧 Troubleshooting

### Browser Test Issues

**"Cannot find module"**
- Make sure you're in the correct directory
- Files should be in `/Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp/`

**"Food database not loading"**
- Check browser console (F12)
- Ensure JSON files are valid
- Check file paths in test.html

### Watch Deployment Issues

**"zeus: command not found"**
```bash
npm install -g @zeppos/zeus-cli
```

**"Device not found"**
```bash
# Check connection
zeus list-devices

# Enable developer mode on watch
# Settings → About → Tap version 10 times
```

---

## 📝 Next Steps

1. ✅ Test in browser (test.html)
2. ✅ Verify calculations work
3. ✅ Deploy to Amazfit Bip 6
4. ✅ Test on physical watch
5. ⏳ Gather feedback
6. ⏳ Fix any issues
7. ⏳ Optimize performance

---

**Ready to test!** 🚀
