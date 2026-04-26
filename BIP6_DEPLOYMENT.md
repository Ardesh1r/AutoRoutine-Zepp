# Deploy Meal Logger to Amazfit Bip 6

Complete guide to deploy and test on your Amazfit Bip 6 watch.

## 🎯 Quick Start

### Step 1: Browser Test First (Recommended)
```bash
cd /Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp
./run_browser_test.sh
```

Then open: http://localhost:8000/test.html

Test all features before deploying to watch.

### Step 2: Install Zepp CLI
```bash
npm install -g @zeppos/zeus-cli
```

### Step 3: Deploy to Bip 6
```bash
cd /Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp
zeus build
zeus preview --device
```

---

## 📱 Amazfit Bip 6 Setup

### Prerequisites

1. **Amazfit Bip 6 Watch**
   - Zepp OS compatible
   - USB cable or WiFi connection

2. **Zepp App on Phone**
   - iOS: App Store
   - Android: Google Play
   - Must be paired with watch

3. **Computer**
   - Node.js 14+
   - npm

### Enable Developer Mode on Bip 6

1. Open **Settings** on watch
2. Scroll to **About**
3. Tap version number **10 times**
4. **Developer Mode** will be enabled

### Connect Watch to Computer

**Option A: USB Cable**
- Connect Bip 6 to computer via USB
- Watch will show USB connection notification

**Option B: WiFi**
- Ensure watch and computer are on same WiFi
- Watch will show WiFi connection option

---

## 🔧 Installation Steps

### Step 1: Install Zepp CLI

```bash
# Install the correct Zepp CLI package
npm install -g @zeppos/zeus-cli

# Verify installation
zeus --version
```

**Expected output:**
```
zeus version 1.9.0
```

### Step 2: Navigate to Project

```bash
cd /Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp

# Verify files are present
ls -la pages/meal_logger.js
ls -la utils/MealLogger.js
ls -la FOOD_DATABASE_PART1.json
ls -la FOOD_DATABASE_PART2.json
ls -la UK_DIETARY_GUIDELINES.json
```

### Step 3: Build App

```bash
# Build the app
zeus build

# This creates dist/ folder with compiled app
```

**Expected output:**
```
Building app...
Build successful!
```

### Step 4: List Connected Devices

```bash
# Check if Bip 6 is connected
zeus list-devices

# Expected output:
# Device: Amazfit Bip 6
# Status: Connected
```

### Step 5: Deploy to Watch

```bash
# Deploy to connected device
zeus preview --device

# Or specify device explicitly
zeus preview --device --target amazfit-bip-6
```

**Expected output:**
```
Deploying to device...
App installed successfully!
```

---

## 🧪 Test on Watch

### Launch App

1. On watch: **Apps** → **AutoRoutine** → **Meal Logger**
2. Or swipe to find **Meal Logger**

### Test Features

1. **Log a Meal**
   - Click "Log Meal"
   - Select "Breakfast"
   - Select "Egg, whole, raw"
   - Select "1 large egg (50g)"
   - Click "Log"

2. **View Daily Summary**
   - Click "View Daily Summary"
   - Check calories: should show 72
   - Check protein: should show 6.3g

3. **Quick Log**
   - Click "Egg" button
   - Should log instantly

4. **Settings**
   - Click "Settings"
   - View user profile
   - Click "Clear Today's Log"

### Performance Check

- **Response Time**: Should be <1 second
- **Screen Transitions**: Should be smooth
- **No Crashes**: App should not freeze
- **Battery**: Should have minimal impact

---

## 🐛 Troubleshooting

### "zeus: command not found"

```bash
# Reinstall Zepp CLI
npm install -g @zeppos/zeus-cli

# Verify
zeus --version
```

### "Device not found"

```bash
# Check if device is connected
zeus list-devices

# If not listed:
1. Enable Developer Mode on watch
   Settings → About → Tap version 10 times
2. Reconnect USB cable or WiFi
3. Try again
```

### "Build failed"

```bash
# Clean build
rm -rf dist/
zeus build

# If still fails:
1. Check Node.js version: node --version (should be 14+)
2. Check npm: npm --version
3. Reinstall Zepp CLI: npm install -g @zeppos/zeus-cli
```

### "App won't launch on watch"

```bash
# View logs
zeus log --verbose

# Check for errors
# Common issues:
# - File paths incorrect
# - JSON syntax errors
# - Missing dependencies
```

### "App crashes immediately"

```bash
# View detailed logs
zeus log --verbose

# Check meal_logger.js for errors
# Verify all require() paths are correct
# Test in browser first: ./run_browser_test.sh
```

### "Slow performance on watch"

```bash
# Optimize:
1. Reduce number of widgets on screen
2. Use SCROLL_LIST for long lists
3. Cache calculations
4. Minimize animations

# Test on simulator first to identify bottleneck
```

---

## 📊 Testing Checklist

- [ ] Browser test works (test.html)
- [ ] Zepp CLI installed
- [ ] App builds successfully
- [ ] Bip 6 connected to computer
- [ ] Developer Mode enabled on watch
- [ ] App deploys to watch
- [ ] App launches on watch
- [ ] Can navigate screens
- [ ] Can log a meal
- [ ] Daily summary calculates correctly
- [ ] Quick log buttons work
- [ ] Settings accessible
- [ ] No crashes or freezes
- [ ] Response time is fast
- [ ] Battery impact is minimal

---

## 🔍 Verify Installation

### Check Files

```bash
cd /Users/Ardi/Documents/OpenSource/AutoRoutine-Zepp

# Core files
ls -lh pages/meal_logger.js          # Should be 18KB
ls -lh utils/MealLogger.js           # Should be 11KB

# Data files
ls -lh FOOD_DATABASE_PART1.json      # Should be 25KB
ls -lh FOOD_DATABASE_PART2.json      # Should be 20KB
ls -lh UK_DIETARY_GUIDELINES.json    # Should be 7.1KB

# Configuration
grep -c "meal_logger" app.json       # Should show 3
```

### Check Zepp CLI

```bash
# Verify installation
zeus --version

# List devices
zeus list-devices

# Check build
zeus build
```

---

## 📝 Next Steps

1. ✅ Test in browser (test.html)
2. ✅ Install Zepp CLI
3. ✅ Build app
4. ✅ Deploy to Bip 6
5. ✅ Test on watch
6. ⏳ Gather feedback
7. ⏳ Fix any issues
8. ⏳ Optimize performance

---

## 💡 Tips

### For Better Performance
- Log meals regularly to test calculations
- Test with 10+ meals to verify daily summary
- Check battery impact over 24 hours
- Monitor watch responsiveness

### For Debugging
- Use `zeus log --verbose` to see detailed logs
- Test in browser first (test.html) before watch
- Check console for JavaScript errors
- Verify JSON files are valid

### For Optimization
- Reduce animation complexity
- Cache food list data
- Minimize widget count per screen
- Use efficient data structures

---

## 🎉 Success!

When you see the app running on your Amazfit Bip 6:

1. **Log a meal** to test functionality
2. **View daily summary** to verify calculations
3. **Test quick log** for speed
4. **Check settings** for configuration
5. **Monitor battery** for impact

---

## 📞 Support

- **Zepp Docs**: https://docs.zepp.com/
- **API Reference**: https://docs.zepp.com/docs/reference/
- **Community**: https://github.com/zepp-health/awesome-zeppos
- **Issues**: Check GitHub for similar problems

---

**Ready to deploy to your Amazfit Bip 6!** 🚀

Start with browser test:
```bash
./run_browser_test.sh
```

Then deploy to watch:
```bash
zeus build && zeus preview --device
```
