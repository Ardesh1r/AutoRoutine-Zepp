# Zepp OS Setup & Deployment Guide - Meal Logger

Complete guide to integrate meal logging system into your Amazfit watch app.

## 📋 Table of Contents

1. [Project Setup](#project-setup)
2. [File Structure](#file-structure)
3. [Configuration](#configuration)
4. [Testing on Simulator](#testing-on-simulator)
5. [Testing on Physical Watch](#testing-on-physical-watch)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Project Setup

### Prerequisites

```bash
# Check Node.js version
node --version  # Should be 14.0.0 or higher

# Install Zepp CLI globally
npm install -g @zepp/cli

# Verify installation
zepp --version
```

### Initialize Project

```bash
cd /Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp

# Install dependencies
npm install

# Verify structure
ls -la pages/
ls -la utils/
ls -la assets/
```

---

## File Structure

```
AutoRoutine-Zepp/
├── pages/
│   ├── index.js                    # Main dashboard (existing)
│   ├── routine-detail.js           # Routine viewer (existing)
│   ├── rule-editor.js              # Rule editor (existing)
│   ├── status.js                   # Status dashboard (existing)
│   └── meal_logger.js              # NEW: Meal logging UI
│
├── utils/
│   ├── rule-engine.js              # Rule engine (existing)
│   ├── sensor-manager.js           # Sensor manager (existing)
│   └── MealLogger.js               # NEW: Meal logging class
│
├── assets/
│   ├── FOOD_DATABASE_PART1.json    # NEW: 50 foods
│   ├── FOOD_DATABASE_PART2.json    # NEW: 50 foods
│   ├── UK_DIETARY_GUIDELINES.json  # NEW: Guidelines
│   ├── icon.png                    # App icon (existing)
│   └── preview.png                 # Preview icon (existing)
│
├── workers/
│   └── rule-engine.js              # Background worker (existing)
│
├── app.json                        # UPDATED: Added meal_logger page
├── app.js                          # App entry point (existing)
├── package.json                    # Dependencies (existing)
└── README.md                       # Documentation (existing)
```

---

## Configuration

### Step 1: Copy Files to Project

```bash
cd /Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp

# Copy meal logger page
cp pages/meal_logger.js pages/meal_logger.js

# Copy meal logger class
cp MEAL_LOGGER.js utils/MealLogger.js

# Copy food databases to assets
cp FOOD_DATABASE_PART1.json assets/
cp FOOD_DATABASE_PART2.json assets/
cp UK_DIETARY_GUIDELINES.json assets/
```

### Step 2: Verify app.json

The app.json has been updated to include the meal_logger page:

```json
{
  "app": {
    "pages": [
      "pages/index",
      "pages/routine-detail",
      "pages/rule-editor",
      "pages/status",
      "pages/meal_logger"  // NEW
    ]
  },
  "module": {
    "pages": [
      // ... existing pages ...
      {
        "path": "pages/meal_logger",
        "component": "pages/meal_logger"
      }
    ]
  }
}
```

### Step 3: Verify package.json

Ensure package.json has build scripts:

```json
{
  "scripts": {
    "build": "zepp build",
    "preview": "zepp preview",
    "simulator": "zepp simulator",
    "test": "zepp preview --device"
  }
}
```

---

## Testing on Simulator

### Start Simulator

```bash
cd /Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp

# Start the simulator
npm run simulator

# Or use zepp directly
zepp simulator
```

**Output:**
```
Starting Zepp simulator...
Simulator running at http://localhost:8080
Watching for file changes...
```

### Access Simulator

1. Open browser: http://localhost:8080
2. Select device: Amazfit GTR 4 (or your device)
3. App loads automatically

### Test Meal Logger

1. **Navigate to Meal Logger**
   - In simulator, find app navigation
   - Click "Meal Logger" or swipe to it

2. **Test Main Screen**
   - ✓ View Daily Summary button
   - ✓ Log Meal button
   - ✓ Quick log buttons (Egg, Apple, Chicken, Water)
   - ✓ Settings button

3. **Test Meal Logging**
   - Click "Log Meal"
   - Select "Breakfast"
   - Select "Egg, whole, raw"
   - Select "1 large egg (50g)"
   - Click "Log"
   - Should return to main screen

4. **Test Daily Summary**
   - Click "View Daily Summary"
   - Should show:
     - Calories: 72/2500
     - Protein: 6.3/55g
     - Carbs: 0.4/300g
     - Fat: 5/95g
     - Sugar: 0.4/50g
     - Fiber: 0/30g
     - Alcohol: 0/14 units

5. **Test Settings**
   - Click "Settings"
   - View user profile
   - Click "Clear Today's Log"
   - Should clear all meals

### Debug in Simulator

Open browser console (F12):

```javascript
// View logs
console.log('Meal logged successfully');

// Check state
console.log(this.state);

// Test calculations
console.log(mealLogger.getDailySummary());
```

---

## Testing on Physical Watch

### Prerequisites

1. **Enable Developer Mode on Watch**
   ```
   Settings → About → Tap version number 10 times
   Developer Mode: Enabled
   ```

2. **Connect Watch**
   - USB cable to computer
   - Or WiFi (if supported)

3. **Zepp App on Phone**
   - Download from App Store or Google Play
   - Pair watch with phone
   - Enable developer mode in Zepp app

### Deploy to Watch

```bash
cd /Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp

# Build the app
npm run build

# Deploy to connected watch
npm run test

# Or use zepp directly
zepp preview --device
```

**Output:**
```
Building app...
Build successful!
Deploying to device...
App installed on watch
```

### Test on Watch

1. **Open App**
   - Watch: Apps → AutoRoutine → Meal Logger
   - Or: Swipe to find Meal Logger

2. **Log a Meal**
   - Click "Log Meal"
   - Select "Breakfast"
   - Select "Egg, whole, raw"
   - Select "1 large egg (50g)"
   - Click "Log"

3. **View Summary**
   - Click "View Daily Summary"
   - Verify calculations

4. **Test Quick Log**
   - Click "Egg" quick button
   - Should log instantly

5. **Test Performance**
   - Measure response time (should be <1 second)
   - Check screen transitions are smooth
   - Verify no lag or freezing

### View Watch Logs

```bash
# Real-time logs from watch
zepp log

# Verbose output
zepp log --verbose

# Filter by app
zepp log --filter meal
```

---

## Deployment

### Build for Release

```bash
cd /Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp

# Build optimized version
zepp build --release

# Output: dist/meal-logger.zip
```

### Package Structure

The build creates:
```
dist/
├── meal-logger.zip          # Ready for upload
├── manifest.json            # App metadata
└── resources/               # Assets
```

### Upload to Zepp Store

1. **Create Developer Account**
   - Go to https://developer.zepp.com/
   - Sign up with email

2. **Create App**
   - App Name: "Meal Logger"
   - Category: Health & Fitness
   - Description: "100-food meal logging system with UK diet tracking"

3. **Upload App**
   - Upload dist/meal-logger.zip
   - Fill in app details
   - Add screenshots (from simulator)
   - Add description and changelog

4. **Submit for Review**
   - Review takes 1-7 days
   - Zepp team will test on devices
   - You'll receive approval/feedback

### Version Management

Update version in app.json:

```json
{
  "app": {
    "version": "1.0.1",
    "versionCode": 2
  }
}
```

Then rebuild and resubmit.

---

## Troubleshooting

### Build Errors

**Error: "Cannot find module '@zos/ui'"**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules/
npm install
```

**Error: "Invalid JSON in app.json"**
```bash
# Solution: Validate JSON
cat app.json | jq .

# Fix syntax errors and rebuild
zepp build
```

### Simulator Issues

**Simulator won't start**
```bash
# Kill existing simulator
zepp simulator --kill

# Clear cache
rm -rf .zepp/

# Restart
zepp simulator
```

**App not loading in simulator**
```bash
# Check browser console (F12)
# Look for errors

# Rebuild
zepp build

# Restart simulator
zepp simulator
```

### Watch Deployment Issues

**"Device not found"**
```bash
# Ensure watch is connected
# Check USB cable or WiFi connection

# List connected devices
zepp list-devices

# Specify device explicitly
zepp preview --device --target amazfit-gtr-4
```

**"Permission denied"**
```bash
# Ensure developer mode is enabled on watch
# Settings → About → Tap version 10 times

# Restart Zepp app on phone
# Reconnect watch
```

**"App crashes on launch"**
```bash
# View logs
zepp log

# Check for errors in meal_logger.js
# Verify all require() paths are correct

# Test on simulator first
zepp simulator
```

### Performance Issues

**Slow screen transitions**
```javascript
// In meal_logger.js, optimize rendering:
// - Reduce number of widgets
// - Use SCROLL_LIST for long lists
// - Cache calculations
```

**High memory usage**
```javascript
// Check for memory leaks:
// - Clear widgets before switching screens
// - Don't store large objects in state
// - Use local variables when possible
```

**Battery drain**
```javascript
// Optimize for battery:
// - Avoid frequent screen updates
// - Use efficient data structures
// - Minimize background processing
```

---

## Quick Commands Reference

```bash
# Build
npm run build

# Start simulator
npm run simulator

# Deploy to watch
npm run test

# View logs
zepp log

# List devices
zepp list-devices

# Kill simulator
zepp simulator --kill

# Clean build
rm -rf dist/ && npm run build

# Full reset
rm -rf node_modules/ dist/ .zepp/
npm install
npm run build
```

---

## Testing Checklist

- [ ] Simulator starts without errors
- [ ] App loads in simulator
- [ ] Meal Logger page accessible
- [ ] Main screen displays correctly
- [ ] Meal type selection works
- [ ] Food list scrolls smoothly
- [ ] Serving size selection works
- [ ] Confirmation screen shows nutrition
- [ ] Meal logging saves correctly
- [ ] Daily summary calculates correctly
- [ ] Settings screen accessible
- [ ] Quick log buttons work
- [ ] No console errors
- [ ] App builds successfully
- [ ] App deploys to watch
- [ ] App runs on physical watch
- [ ] Response time <1 second
- [ ] No crashes or freezes
- [ ] Battery impact minimal

---

## Support Resources

- **Zepp OS Documentation**: https://docs.zepp.com/
- **API Reference**: https://docs.zepp.com/docs/reference/
- **Community Forum**: https://github.com/zepp-health/awesome-zeppos
- **GitHub Issues**: Report bugs and ask questions
- **Zepp Developer**: https://developer.zepp.com/

---

## Next Steps

1. ✅ Setup project structure
2. ✅ Configure app.json
3. ✅ Test on simulator
4. ✅ Test on physical watch
5. ⏳ Gather user feedback
6. ⏳ Add advanced features
7. ⏳ Submit to Zepp Store
8. ⏳ Monitor and iterate

---

**Ready to test on your Amazfit watch!** 🎯
