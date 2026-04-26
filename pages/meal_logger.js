import { createWidget, widget, prop, event } from '@zos/ui';
import { getStatusBarHeight } from '@zos/display';
import { px } from '@zos/utils';

const { 
  TEXT, 
  BUTTON, 
  SCROLL_LIST, 
  IMG, 
  FILL_RECT,
  GROUP
} = widget;

Page({
  state: {
    currentScreen: 'main', // main, mealType, foodList, servingSize, confirm, summary
    selectedMealType: null,
    selectedFood: null,
    selectedServing: null,
    foods: [],
    filteredFoods: [],
    dailySummary: null,
    mealLogger: null,
    guidelines: null
  },

  onInit() {
    this.initializeMealLogger();
  },

  initializeMealLogger() {
    try {
      const part1 = require('../assets/FOOD_DATABASE_PART1.json');
      const part2 = require('../assets/FOOD_DATABASE_PART2.json');
      const guidelines = require('../assets/UK_DIETARY_GUIDELINES.json');
      
      const MealLogger = require('../utils/MealLogger.js');
      
      this.state.mealLogger = new MealLogger(part1, part2);
      this.state.mealLogger.setUserProfile('male', 30, 'moderate');
      this.state.guidelines = guidelines;
      
      // Combine all foods
      this.state.foods = [
        ...Object.values(part1.foods),
        ...Object.values(part2.foods)
      ];
      
      this.showMainScreen();
    } catch (error) {
      console.error('Failed to initialize meal logger:', error);
      this.showError('Failed to load meal logger');
    }
  },

  showMainScreen() {
    this.state.currentScreen = 'main';
    this.clearScreen();
    
    const statusBarHeight = getStatusBarHeight();
    
    // Title
    createWidget(TEXT, {
      x: px(0),
      y: px(statusBarHeight + 10),
      w: px(480),
      h: px(40),
      text: 'Meal Logger',
      font: {
        size: px(32),
        weight: 'bold',
        color: 0xffffff
      },
      align_h: 'center'
    });

    // Daily Summary Button
    createWidget(BUTTON, {
      x: px(20),
      y: px(statusBarHeight + 70),
      w: px(440),
      h: px(60),
      text: 'View Daily Summary',
      normal_src: 'button_bg.png',
      press_src: 'button_press_bg.png',
      text_size: px(20),
      click_func: () => {
        this.showDailySummary();
      }
    });

    // Log Meal Button
    createWidget(BUTTON, {
      x: px(20),
      y: px(statusBarHeight + 150),
      w: px(440),
      h: px(60),
      text: 'Log Meal',
      normal_src: 'button_bg.png',
      press_src: 'button_press_bg.png',
      text_size: px(20),
      click_func: () => {
        this.showMealTypeScreen();
      }
    });

    // Quick Log Buttons
    createWidget(TEXT, {
      x: px(0),
      y: px(statusBarHeight + 230),
      w: px(480),
      h: px(30),
      text: 'Quick Log',
      font: {
        size: px(18),
        weight: 'bold',
        color: 0xffffff
      },
      align_h: 'center'
    });

    // Quick log buttons
    const quickItems = [
      { id: 'food_001', label: 'Egg', serving: '1 large egg (50g)' },
      { id: 'food_021', label: 'Apple', serving: '1 medium (182g)' },
      { id: 'food_005', label: 'Chicken', serving: '100g' },
      { id: 'drink_005', label: 'Water', serving: '250ml glass' }
    ];

    quickItems.forEach((item, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      
      createWidget(BUTTON, {
        x: px(20 + col * 230),
        y: px(statusBarHeight + 270 + row * 50),
        w: px(210),
        h: px(45),
        text: item.label,
        normal_src: 'button_small_bg.png',
        press_src: 'button_small_press_bg.png',
        text_size: px(16),
        click_func: () => {
          this.logQuickMeal(item.id, item.serving);
        }
      });
    });

    // Settings Button
    createWidget(BUTTON, {
      x: px(20),
      y: px(statusBarHeight + 420),
      w: px(440),
      h: px(50),
      text: 'Settings',
      normal_src: 'button_bg.png',
      press_src: 'button_press_bg.png',
      text_size: px(18),
      click_func: () => {
        this.showSettings();
      }
    });
  },

  showMealTypeScreen() {
    this.state.currentScreen = 'mealType';
    this.clearScreen();
    
    const statusBarHeight = getStatusBarHeight();
    
    createWidget(TEXT, {
      x: px(0),
      y: px(statusBarHeight + 10),
      w: px(480),
      h: px(40),
      text: 'Meal Type',
      font: {
        size: px(32),
        weight: 'bold',
        color: 0xffffff
      },
      align_h: 'center'
    });

    const mealTypes = [
      { id: 'breakfast', label: '☀️ Breakfast' },
      { id: 'lunch', label: '🌤️ Lunch' },
      { id: 'dinner', label: '🌙 Dinner' },
      { id: 'snacks', label: '🍿 Snack' },
      { id: 'drinks', label: '🍺 Drink' }
    ];

    mealTypes.forEach((meal, index) => {
      createWidget(BUTTON, {
        x: px(20),
        y: px(statusBarHeight + 70 + index * 60),
        w: px(440),
        h: px(55),
        text: meal.label,
        normal_src: 'button_bg.png',
        press_src: 'button_press_bg.png',
        text_size: px(20),
        click_func: () => {
          this.state.selectedMealType = meal.id;
          this.showFoodListScreen();
        }
      });
    });

    // Back Button
    createWidget(BUTTON, {
      x: px(20),
      y: px(statusBarHeight + 380),
      w: px(440),
      h: px(50),
      text: 'Back',
      normal_src: 'button_bg.png',
      press_src: 'button_press_bg.png',
      text_size: px(18),
      click_func: () => {
        this.showMainScreen();
      }
    });
  },

  showFoodListScreen() {
    this.state.currentScreen = 'foodList';
    this.clearScreen();
    
    const statusBarHeight = getStatusBarHeight();
    
    createWidget(TEXT, {
      x: px(0),
      y: px(statusBarHeight + 10),
      w: px(480),
      h: px(40),
      text: 'Select Food',
      font: {
        size: px(32),
        weight: 'bold',
        color: 0xffffff
      },
      align_h: 'center'
    });

    // Food list
    const listHeight = 300;
    const itemHeight = 50;
    const maxItems = Math.floor(listHeight / itemHeight);

    createWidget(SCROLL_LIST, {
      x: px(0),
      y: px(statusBarHeight + 60),
      w: px(480),
      h: px(listHeight),
      item_height: px(itemHeight),
      item_count: this.state.foods.length,
      on_item_click: (index) => {
        this.state.selectedFood = this.state.foods[index];
        this.showServingSizeScreen();
      },
      item_click_func: (index) => {
        const food = this.state.foods[index];
        return {
          text: food.name,
          text_size: px(16),
          text_color: 0xffffff
        };
      }
    });

    // Back Button
    createWidget(BUTTON, {
      x: px(20),
      y: px(statusBarHeight + 380),
      w: px(440),
      h: px(50),
      text: 'Back',
      normal_src: 'button_bg.png',
      press_src: 'button_press_bg.png',
      text_size: px(18),
      click_func: () => {
        this.showMealTypeScreen();
      }
    });
  },

  showServingSizeScreen() {
    this.state.currentScreen = 'servingSize';
    this.clearScreen();
    
    const statusBarHeight = getStatusBarHeight();
    const food = this.state.selectedFood;
    
    createWidget(TEXT, {
      x: px(0),
      y: px(statusBarHeight + 10),
      w: px(480),
      h: px(40),
      text: food.name,
      font: {
        size: px(28),
        weight: 'bold',
        color: 0xffffff
      },
      align_h: 'center'
    });

    createWidget(TEXT, {
      x: px(0),
      y: px(statusBarHeight + 55),
      w: px(480),
      h: px(30),
      text: 'Serving Size',
      font: {
        size: px(18),
        color: 0xcccccc
      },
      align_h: 'center'
    });

    // Serving buttons
    food.servings.forEach((serving, index) => {
      const isDefault = serving.default ? ' (default)' : '';
      
      createWidget(BUTTON, {
        x: px(20),
        y: px(statusBarHeight + 100 + index * 60),
        w: px(440),
        h: px(55),
        text: `${serving.size}\n${serving.calories} cal`,
        normal_src: 'button_bg.png',
        press_src: 'button_press_bg.png',
        text_size: px(16),
        click_func: () => {
          this.state.selectedServing = serving;
          this.showConfirmScreen();
        }
      });
    });

    // Back Button
    createWidget(BUTTON, {
      x: px(20),
      y: px(statusBarHeight + 380),
      w: px(440),
      h: px(50),
      text: 'Back',
      normal_src: 'button_bg.png',
      press_src: 'button_press_bg.png',
      text_size: px(18),
      click_func: () => {
        this.showFoodListScreen();
      }
    });
  },

  showConfirmScreen() {
    this.state.currentScreen = 'confirm';
    this.clearScreen();
    
    const statusBarHeight = getStatusBarHeight();
    const food = this.state.selectedFood;
    const serving = this.state.selectedServing;
    
    createWidget(TEXT, {
      x: px(0),
      y: px(statusBarHeight + 10),
      w: px(480),
      h: px(40),
      text: 'Confirm',
      font: {
        size: px(32),
        weight: 'bold',
        color: 0xffffff
      },
      align_h: 'center'
    });

    // Food details
    createWidget(TEXT, {
      x: px(20),
      y: px(statusBarHeight + 70),
      w: px(440),
      h: px(30),
      text: food.name,
      font: {
        size: px(20),
        weight: 'bold',
        color: 0xffffff
      }
    });

    createWidget(TEXT, {
      x: px(20),
      y: px(statusBarHeight + 110),
      w: px(440),
      h: px(25),
      text: serving.size,
      font: {
        size: px(16),
        color: 0xcccccc
      }
    });

    // Nutrition info
    const nutritionText = `
Calories: ${serving.calories}
Protein: ${serving.protein}g
Carbs: ${serving.carbs}g
Fat: ${serving.fat}g
Sugar: ${serving.sugar}g
Fiber: ${serving.fiber || 0}g
    `.trim();

    createWidget(TEXT, {
      x: px(20),
      y: px(statusBarHeight + 150),
      w: px(440),
      h: px(150),
      text: nutritionText,
      font: {
        size: px(14),
        color: 0xffffff
      }
    });

    // Confirm Button
    createWidget(BUTTON, {
      x: px(20),
      y: px(statusBarHeight + 320),
      w: px(210),
      h: px(50),
      text: 'Log',
      normal_src: 'button_bg.png',
      press_src: 'button_press_bg.png',
      text_size: px(18),
      click_func: () => {
        this.logMeal();
      }
    });

    // Cancel Button
    createWidget(BUTTON, {
      x: px(250),
      y: px(statusBarHeight + 320),
      w: px(210),
      h: px(50),
      text: 'Cancel',
      normal_src: 'button_bg.png',
      press_src: 'button_press_bg.png',
      text_size: px(18),
      click_func: () => {
        this.showServingSizeScreen();
      }
    });
  },

  logMeal() {
    try {
      const result = this.state.mealLogger.logMeal(
        this.state.selectedFood.id,
        this.state.selectedServing.size,
        this.state.selectedMealType
      );

      if (result.success) {
        this.showSuccess(`Logged: ${this.state.selectedFood.name}`);
        setTimeout(() => {
          this.showMainScreen();
        }, 1500);
      } else {
        this.showError(result.error);
      }
    } catch (error) {
      console.error('Error logging meal:', error);
      this.showError('Failed to log meal');
    }
  },

  logQuickMeal(foodId, servingSize) {
    try {
      const food = this.state.foods.find(f => f.id === foodId);
      if (!food) {
        this.showError('Food not found');
        return;
      }

      const result = this.state.mealLogger.logMeal(
        foodId,
        servingSize,
        'snacks'
      );

      if (result.success) {
        this.showSuccess(`Logged: ${food.name}`);
        setTimeout(() => {
          this.showMainScreen();
        }, 1500);
      } else {
        this.showError(result.error);
      }
    } catch (error) {
      console.error('Error logging quick meal:', error);
      this.showError('Failed to log meal');
    }
  },

  showDailySummary() {
    this.state.currentScreen = 'summary';
    this.clearScreen();
    
    const statusBarHeight = getStatusBarHeight();
    
    try {
      const summary = this.state.mealLogger.getDailySummary(null, this.state.guidelines);
      
      createWidget(TEXT, {
        x: px(0),
        y: px(statusBarHeight + 10),
        w: px(480),
        h: px(40),
        text: 'Daily Summary',
        font: {
          size: px(32),
          weight: 'bold',
          color: 0xffffff
        },
        align_h: 'center'
      });

      const comp = summary.comparison;
      
      const summaryText = `
Calories: ${comp.calories.consumed}/${comp.calories.recommended}
${this.getStatusIcon(comp.calories.status)}

Protein: ${comp.protein.consumed}/${comp.protein.recommended}g
${this.getStatusIcon(comp.protein.status)}

Carbs: ${comp.carbs.consumed}/${comp.carbs.recommended}g
${this.getStatusIcon(comp.carbs.status)}

Fat: ${comp.fat.consumed}/${comp.fat.recommended}g
${this.getStatusIcon(comp.fat.status)}

Sugar: ${comp.sugar.consumed}/${comp.sugar.recommended}g
${this.getStatusIcon(comp.sugar.status)}

Fiber: ${comp.fiber.consumed}/${comp.fiber.recommended}g
${this.getStatusIcon(comp.fiber.status)}

Alcohol: ${comp.alcohol.consumed}/${comp.alcohol.recommended} units
${this.getStatusIcon(comp.alcohol.status)}

Remaining: ${comp.calories.remaining} cal
      `.trim();

      createWidget(TEXT, {
        x: px(10),
        y: px(statusBarHeight + 60),
        w: px(460),
        h: px(350),
        text: summaryText,
        font: {
          size: px(13),
          color: 0xffffff
        }
      });

      // Back Button
      createWidget(BUTTON, {
        x: px(20),
        y: px(statusBarHeight + 420),
        w: px(440),
        h: px(50),
        text: 'Back',
        normal_src: 'button_bg.png',
        press_src: 'button_press_bg.png',
        text_size: px(18),
        click_func: () => {
          this.showMainScreen();
        }
      });
    } catch (error) {
      console.error('Error showing summary:', error);
      this.showError('Failed to load summary');
    }
  },

  showSettings() {
    this.state.currentScreen = 'settings';
    this.clearScreen();
    
    const statusBarHeight = getStatusBarHeight();
    
    createWidget(TEXT, {
      x: px(0),
      y: px(statusBarHeight + 10),
      w: px(480),
      h: px(40),
      text: 'Settings',
      font: {
        size: px(32),
        weight: 'bold',
        color: 0xffffff
      },
      align_h: 'center'
    });

    createWidget(TEXT, {
      x: px(20),
      y: px(statusBarHeight + 70),
      w: px(440),
      h: px(80),
      text: 'User Profile\n\nGender: Male\nAge: 30\nActivity: Moderate',
      font: {
        size: px(16),
        color: 0xffffff
      }
    });

    createWidget(BUTTON, {
      x: px(20),
      y: px(statusBarHeight + 170),
      w: px(440),
      h: px(50),
      text: 'Edit Profile',
      normal_src: 'button_bg.png',
      press_src: 'button_press_bg.png',
      text_size: px(18),
      click_func: () => {
        this.showEditProfile();
      }
    });

    createWidget(BUTTON, {
      x: px(20),
      y: px(statusBarHeight + 240),
      w: px(440),
      h: px(50),
      text: 'Clear Today\'s Log',
      normal_src: 'button_bg.png',
      press_src: 'button_press_bg.png',
      text_size: px(18),
      click_func: () => {
        this.state.mealLogger.clearDailyLog();
        this.showSuccess('Log cleared');
        setTimeout(() => {
          this.showSettings();
        }, 1500);
      }
    });

    createWidget(BUTTON, {
      x: px(20),
      y: px(statusBarHeight + 310),
      w: px(440),
      h: px(50),
      text: 'About',
      normal_src: 'button_bg.png',
      press_src: 'button_press_bg.png',
      text_size: px(18),
      click_func: () => {
        this.showAbout();
      }
    });

    createWidget(BUTTON, {
      x: px(20),
      y: px(statusBarHeight + 380),
      w: px(440),
      h: px(50),
      text: 'Back',
      normal_src: 'button_bg.png',
      press_src: 'button_press_bg.png',
      text_size: px(18),
      click_func: () => {
        this.showMainScreen();
      }
    });
  },

  showEditProfile() {
    // Placeholder for profile editing
    this.showSuccess('Profile editing coming soon');
    setTimeout(() => {
      this.showSettings();
    }, 1500);
  },

  showAbout() {
    this.state.currentScreen = 'about';
    this.clearScreen();
    
    const statusBarHeight = getStatusBarHeight();
    
    createWidget(TEXT, {
      x: px(0),
      y: px(statusBarHeight + 10),
      w: px(480),
      h: px(40),
      text: 'About',
      font: {
        size: px(32),
        weight: 'bold',
        color: 0xffffff
      },
      align_h: 'center'
    });

    createWidget(TEXT, {
      x: px(20),
      y: px(statusBarHeight + 70),
      w: px(440),
      h: px(200),
      text: `Meal Logger v1.0

100 Foods Database
USDA FoodData Central

UK Dietary Guidelines
NHS & UK Government

Alcohol Tracking
WHO Standards

100% Offline
No Internet Required`,
      font: {
        size: px(14),
        color: 0xffffff
      }
    });

    createWidget(BUTTON, {
      x: px(20),
      y: px(statusBarHeight + 420),
      w: px(440),
      h: px(50),
      text: 'Back',
      normal_src: 'button_bg.png',
      press_src: 'button_press_bg.png',
      text_size: px(18),
      click_func: () => {
        this.showSettings();
      }
    });
  },

  showSuccess(message) {
    this.clearScreen();
    const statusBarHeight = getStatusBarHeight();
    
    createWidget(TEXT, {
      x: px(0),
      y: px(statusBarHeight + 200),
      w: px(480),
      h: px(80),
      text: `✓\n${message}`,
      font: {
        size: px(24),
        color: 0x00ff00
      },
      align_h: 'center'
    });
  },

  showError(message) {
    this.clearScreen();
    const statusBarHeight = getStatusBarHeight();
    
    createWidget(TEXT, {
      x: px(0),
      y: px(statusBarHeight + 200),
      w: px(480),
      h: px(80),
      text: `✗\n${message}`,
      font: {
        size: px(24),
        color: 0xff0000
      },
      align_h: 'center'
    });
  },

  getStatusIcon(status) {
    switch (status) {
      case 'on-track':
        return '✓';
      case 'under':
        return '↓';
      case 'over':
        return '↑';
      default:
        return '○';
    }
  },

  clearScreen() {
    // Clear all widgets (Zepp OS will handle this)
    // This is a placeholder for screen clearing logic
  }
});
