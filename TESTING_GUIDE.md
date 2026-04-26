# Testing Guide - Meal Logger on Amazfit Watch

## Prerequisites

1. **Zepp CLI** - Install globally
   ```bash
   npm install -g @zepp/cli
   ```

2. **Node.js 14+** - Required for Zepp CLI
   ```bash
   node --version  # Should be 14.0.0 or higher
   ```

3. **Amazfit Watch** - With Zepp OS
   - Amazfit Active 2
   - Amazfit T-Rex 3
   - Amazfit Balance
   - Amazfit Bip 5
   - Amazfit GTS 4
   - Amazfit GTR 4
   - Or any device with Zepp OS (API Level 3+)

4. **Zepp App** - Installed on your phone
   - iOS: App Store
   - Android: Google Play

## Project Structure

```
AutoRoutine-Zepp/
├── pages/
│   └── meal_logger.js          # Watch UI screens
├── utils/
│   └── MealLogger.js           # Meal logging class
├── assets/
│   ├── FOOD_DATABASE_PART1.json
│   ├── FOOD_DATABASE_PART2.json
│   └── UK_DIETARY_GUIDELINES.json
├── app.json                    # Zepp app configuration
├── app.js                      # App entry point
└── package.json
```

## Step 1: Setup Project

### 1.1 Create Zepp Project Structure

```bash
cd /Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp

# Create required directories
mkdir -p pages utils assets

# Copy food databases to assets
cp FOOD_DATABASE_PART1.json assets/
cp FOOD_DATABASE_PART2.json assets/
cp UK_DIETARY_GUIDELINES.json assets/

# Copy MEAL_LOGGER.js to utils
cp MEAL_LOGGER.js utils/MealLogger.js
```

### 1.2 Create app.json

```json
{
  "app": {
    "appId": "com.zepp.meal-logger",
    "appName": "Meal Logger",
    "appVersion": "1.0.0",
    "targets": ["gtr-4", "gts-4", "active-2", "balance"],
    "permissions": ["device", "activity"],
    "pages": [
      "pages/meal_logger"
    ],
    "defaultPage": "pages/meal_logger"
  },
  "deviceTestInfo": {
    "list": [
      {
        "appId": "com.zepp.meal-logger",
        "appName": "Meal Logger",
        "icon": "icon.png",
        "pages": ["pages/meal_logger"],
        "defaultPage": "pages/meal_logger"
      }
    ]
  }
}
```

### 1.3 Create app.js

```javascript
import { createApp } from '@zos/app';

const app = createApp({
  globalData: {
    foodDatabase: null,
    guidelines: null
  },
  onCreate() {
    console.log('Meal Logger app created');
  },
  onDestroy() {
    console.log('Meal Logger app destroyed');
  }
});

export default app;
```

### 1.4 Create package.json

```json
{
  "name": "meal-logger",
  "version": "1.0.0",
  "description": "Meal logging system for Amazfit watches",
  "main": "app.js",
  "scripts": {
    "build": "zepp build",
    "preview": "zepp preview",
    "simulator": "zepp simulator",
    "test": "zepp preview --device"
  },
  "dependencies": {},
  "devDependencies": {
    "@zepp/cli": "^1.0.0"
  }
}
```

## Step 2: Test on Simulator

### 2.1 Start Simulator

```bash
cd /Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp

# Start the simulator
zepp simulator
```

This will:
- Start a local development server
- Open simulator in browser
- Watch for file changes

### 2.2 Test in Simulator

1. **Main Screen**
   - Click "View Daily Summary" - Should show empty summary
   - Click "Log Meal" - Should show meal type selection
   - Click quick log buttons - Should log meals

2. **Meal Type Selection**
   - Select "Breakfast" - Should show food list
   - Select "Lunch" - Should show food list
   - Select "Dinner" - Should show food list
   - Select "Snack" - Should show food list
   - Select "Drink" - Should show drink list

3. **Food Selection**
   - Scroll through food list
   - Select "Egg, whole, raw" - Should show serving sizes
   - Select "Chicken breast, cooked" - Should show serving sizes

4. **Serving Size**
   - Select "1 large egg (50g)" - Should show confirmation
   - Select "2 large eggs (100g)" - Should show confirmation

5. **Confirmation**
   - Click "Log" - Should log meal and return to main
   - Click "Cancel" - Should go back to serving selection

6. **Daily Summary**
   - After logging meals, should show:
     - Calories consumed vs recommended
     - Macros (protein, carbs, fat)
     - Sugar and fiber
     - Alcohol units
     - Remaining calories

7. **Settings**
   - Click "Settings" from main screen
   - View user profile
   - Click "Clear Today's Log" - Should clear all meals
   - Click "About" - Should show app info

## Step 3: Test on Physical Watch

### 3.1 Connect Watch to Computer

1. **Enable Developer Mode on Watch**
   - Settings → About → Tap version 10 times
   - Developer Mode enabled

2. **Connect via USB**
   - Connect watch to computer via USB cable
   - Or connect via WiFi (if supported)

3. **Pair with Zepp App**
   - Open Zepp app on phone
   - Add device
   - Follow pairing instructions

### 3.2 Deploy to Watch

```bash
cd /Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp

# Build the app
zepp build

# Deploy to connected watch
zepp preview --device

# Or use:
zepp preview --watch
```

### 3.3 Test on Watch

1. **Navigate to App**
   - Open Zepp app on phone
   - Find "Meal Logger" in apps
   - Or on watch: Apps → Meal Logger

2. **Test Main Features**
   - Log a meal (egg + toast)
   - Log a drink (beer)
   - View daily summary
   - Check calculations

3. **Test Performance**
   - Measure response time (should be <1 second)
   - Check battery usage (should be minimal)
   - Monitor memory usage

4. **Test Edge Cases**
   - Log 10+ meals in one day
   - Clear log and log again
   - Check summary with 0 meals
   - Test with different user profiles

## Step 4: Debugging

### 4.1 View Logs

```bash
# View real-time logs from device
zepp log

# View logs from simulator
# Check browser console (F12)
```

### 4.2 Common Issues

**Issue: "Cannot find module"**
```
Solution: Ensure all files are in correct directories
- pages/meal_logger.js
- utils/MealLogger.js
- assets/FOOD_DATABASE_PART1.json
- assets/FOOD_DATABASE_PART2.json
- assets/UK_DIETARY_GUIDELINES.json
```

**Issue: "Widget not rendering"**
```
Solution: Check Zepp OS version compatibility
- Ensure using correct widget API
- Check px() function is imported
- Verify coordinates are within screen bounds
```

**Issue: "Food database not loading"**
```
Solution: Check JSON file paths
- Ensure files are in assets/ directory
- Check require() paths match file locations
- Verify JSON is valid (no syntax errors)
```

**Issue: "Calculations incorrect"**
```
Solution: Check MealLogger.js
- Verify nutrition values in database
- Check calculation logic
- Test with known values
```

### 4.3 Enable Debug Mode

```javascript
// In meal_logger.js, add:
const DEBUG = true;

if (DEBUG) {
  console.log('Screen:', this.state.currentScreen);
  console.log('Selected food:', this.state.selectedFood);
  console.log('Selected serving:', this.state.selectedServing);
}
```

## Step 5: Performance Testing

### 5.1 Measure Response Time

```javascript
// Add timing to meal_logger.js
const startTime = Date.now();

// ... perform action ...

const endTime = Date.now();
console.log(`Action took ${endTime - startTime}ms`);
```

**Target Performance:**
- Screen transitions: <500ms
- Meal logging: <1000ms
- Summary calculation: <500ms

### 5.2 Memory Usage

Monitor in Zepp CLI:
```bash
zepp preview --device --verbose
```

**Target Memory:**
- App size: <5MB
- Runtime memory: <10MB

### 5.3 Battery Impact

Test on watch:
- Log 50 meals in one day
- Check battery drain (should be <1% per day)

## Step 6: Deployment

### 6.1 Build for Release

```bash
# Build optimized version
zepp build --release

# This creates:
# dist/meal-logger.zip (ready to upload)
```

### 6.2 Upload to Zepp Store

1. Go to https://developer.zepp.com/
2. Create developer account
3. Upload app
4. Fill in app details
5. Submit for review

### 6.3 Version Management

Update version in app.json:
```json
{
  "app": {
    "appVersion": "1.0.1"
  }
}
```

## Testing Checklist

- [ ] Simulator test passed
- [ ] Physical watch deployment successful
- [ ] Main screen displays correctly
- [ ] Meal type selection works
- [ ] Food list scrolls smoothly
- [ ] Serving size selection works
- [ ] Confirmation screen shows correct nutrition
- [ ] Meal logging saves correctly
- [ ] Daily summary calculates correctly
- [ ] Settings screen accessible
- [ ] Clear log functionality works
- [ ] Quick log buttons work
- [ ] No console errors
- [ ] Response time <1 second
- [ ] Battery impact minimal
- [ ] Works on multiple watch models

## Troubleshooting Commands

```bash
# Clear build cache
rm -rf dist/

# Reinstall dependencies
rm -rf node_modules/
npm install

# Rebuild from scratch
zepp build --clean

# Test specific device
zepp preview --device --target gtr-4

# View detailed logs
zepp log --verbose

# Kill simulator
zepp simulator --kill
```

## Support Resources

- **Zepp OS Docs**: https://docs.zepp.com/
- **API Reference**: https://docs.zepp.com/docs/reference/
- **Community**: https://github.com/zepp-health/awesome-zeppos
- **Issues**: Check GitHub issues for similar problems

---

**Ready to test on your watch!** 🎯
