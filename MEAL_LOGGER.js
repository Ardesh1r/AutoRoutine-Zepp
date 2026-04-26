class MealLogger {
  constructor(foodDatabasePart1, foodDatabasePart2) {
    this.foods = {
      ...foodDatabasePart1.foods,
      ...foodDatabasePart2.foods
    };
    this.dailyLog = {};
    this.userProfile = {
      gender: "male",
      age: 30,
      activityLevel: "moderate"
    };
  }

  setUserProfile(gender, age, activityLevel = "moderate") {
    this.userProfile = { gender, age, activityLevel };
  }

  logMeal(foodId, servingSize, mealType, time = null) {
    const food = this.findFood(foodId);
    if (!food) {
      return { error: `Food ${foodId} not found` };
    }

    const serving = food.servings.find(s => s.size === servingSize);
    if (!serving) {
      return { error: `Serving size "${servingSize}" not found for ${food.name}` };
    }

    const today = this.getToday();
    if (!this.dailyLog[today]) {
      this.dailyLog[today] = {
        date: today,
        meals: [],
        summary: this.initializeSummary()
      };
    }

    const mealEntry = {
      id: `meal_${Date.now()}`,
      foodId: foodId,
      foodName: food.name,
      mealType: mealType,
      servingSize: servingSize,
      time: time || this.getCurrentTime(),
      nutrition: {
        calories: serving.calories,
        protein: serving.protein,
        carbs: serving.carbs,
        fat: serving.fat,
        saturatedFat: serving.saturatedFat,
        sugar: serving.sugar,
        fiber: serving.fiber || 0,
        salt: serving.salt || 0,
        alcohol: serving.alcohol || 0,
        units: serving.units || 0
      }
    };

    this.dailyLog[today].meals.push(mealEntry);
    this.updateDailySummary(today);

    return {
      success: true,
      meal: mealEntry,
      dailySummary: this.getDailySummary(today)
    };
  }

  findFood(foodId) {
    for (const food of Object.values(this.foods)) {
      if (food.id === foodId) {
        return food;
      }
    }
    return null;
  }

  initializeSummary() {
    return {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalSaturatedFat: 0,
      totalSugar: 0,
      totalFiber: 0,
      totalSalt: 0,
      totalAlcohol: 0,
      totalUnits: 0
    };
  }

  updateDailySummary(date) {
    const log = this.dailyLog[date];
    if (!log) return;

    const summary = this.initializeSummary();

    log.meals.forEach(meal => {
      summary.totalCalories += meal.nutrition.calories;
      summary.totalProtein += meal.nutrition.protein;
      summary.totalCarbs += meal.nutrition.carbs;
      summary.totalFat += meal.nutrition.fat;
      summary.totalSaturatedFat += meal.nutrition.saturatedFat;
      summary.totalSugar += meal.nutrition.sugar;
      summary.totalFiber += meal.nutrition.fiber;
      summary.totalSalt += meal.nutrition.salt;
      summary.totalAlcohol += meal.nutrition.alcohol;
      summary.totalUnits += meal.nutrition.units;
    });

    log.summary = summary;
  }

  getDailySummary(date = null, guidelines = null) {
    const targetDate = date || this.getToday();
    const log = this.dailyLog[targetDate];

    if (!log) {
      return {
        date: targetDate,
        meals: [],
        summary: this.initializeSummary(),
        comparison: null
      };
    }

    if (!guidelines) {
      return {
        date: targetDate,
        meals: log.meals,
        summary: log.summary
      };
    }

    const recommended = this.getRecommendedIntake(guidelines);
    const summary = log.summary;

    const comparison = {
      calories: {
        consumed: Math.round(summary.totalCalories),
        recommended: recommended.calories,
        remaining: Math.round(recommended.calories - summary.totalCalories),
        percentage: Math.round((summary.totalCalories / recommended.calories) * 100),
        status: this.getStatus(summary.totalCalories, recommended.calories)
      },
      protein: {
        consumed: Math.round(summary.totalProtein * 10) / 10,
        recommended: recommended.protein,
        remaining: Math.round((recommended.protein - summary.totalProtein) * 10) / 10,
        percentage: Math.round((summary.totalProtein / recommended.protein) * 100),
        status: this.getStatus(summary.totalProtein, recommended.protein)
      },
      carbs: {
        consumed: Math.round(summary.totalCarbs * 10) / 10,
        recommended: recommended.carbs,
        remaining: Math.round((recommended.carbs - summary.totalCarbs) * 10) / 10,
        percentage: Math.round((summary.totalCarbs / recommended.carbs) * 100),
        status: this.getStatus(summary.totalCarbs, recommended.carbs)
      },
      fat: {
        consumed: Math.round(summary.totalFat * 10) / 10,
        recommended: recommended.fat,
        remaining: Math.round((recommended.fat - summary.totalFat) * 10) / 10,
        percentage: Math.round((summary.totalFat / recommended.fat) * 100),
        status: this.getStatus(summary.totalFat, recommended.fat)
      },
      saturatedFat: {
        consumed: Math.round(summary.totalSaturatedFat * 10) / 10,
        recommended: recommended.saturatedFat,
        remaining: Math.round((recommended.saturatedFat - summary.totalSaturatedFat) * 10) / 10,
        percentage: Math.round((summary.totalSaturatedFat / recommended.saturatedFat) * 100),
        status: summary.totalSaturatedFat > recommended.saturatedFat ? "over" : "under",
        warning: summary.totalSaturatedFat > recommended.saturatedFat ? "Reduce saturated fat" : null
      },
      sugar: {
        consumed: Math.round(summary.totalSugar * 10) / 10,
        recommended: recommended.sugar,
        remaining: Math.round((recommended.sugar - summary.totalSugar) * 10) / 10,
        percentage: Math.round((summary.totalSugar / recommended.sugar) * 100),
        status: summary.totalSugar > recommended.sugar ? "over" : "under",
        warning: summary.totalSugar > recommended.sugar ? "Reduce sugar intake" : null
      },
      fiber: {
        consumed: Math.round(summary.totalFiber * 10) / 10,
        recommended: recommended.fiber,
        remaining: Math.round((recommended.fiber - summary.totalFiber) * 10) / 10,
        percentage: Math.round((summary.totalFiber / recommended.fiber) * 100),
        status: this.getStatus(summary.totalFiber, recommended.fiber)
      },
      salt: {
        consumed: Math.round(summary.totalSalt * 10) / 10,
        recommended: recommended.salt,
        remaining: Math.round((recommended.salt - summary.totalSalt) * 10) / 10,
        percentage: Math.round((summary.totalSalt / recommended.salt) * 100),
        status: summary.totalSalt > recommended.salt ? "over" : "under",
        warning: summary.totalSalt > recommended.salt ? "Reduce salt intake" : null
      },
      alcohol: {
        consumed: Math.round(summary.totalUnits * 10) / 10,
        recommended: recommended.alcoholUnits,
        remaining: Math.round((recommended.alcoholUnits - summary.totalUnits) * 10) / 10,
        percentage: Math.round((summary.totalUnits / recommended.alcoholUnits) * 100),
        status: this.getAlcoholStatus(summary.totalUnits, recommended.alcoholUnits),
        warning: this.getAlcoholWarning(summary.totalUnits, recommended.alcoholUnits)
      }
    };

    return {
      date: targetDate,
      meals: log.meals,
      summary: summary,
      comparison: comparison,
      insights: this.generateInsights(comparison)
    };
  }

  getRecommendedIntake(guidelines) {
    const { gender, age } = this.userProfile;

    if (gender === "male") {
      return age > 50
        ? guidelines.recommendedDailyIntake.adult_male_51plus
        : guidelines.recommendedDailyIntake.adult_male;
    } else {
      return age > 50
        ? guidelines.recommendedDailyIntake.adult_female_51plus
        : guidelines.recommendedDailyIntake.adult_female;
    }
  }

  getStatus(consumed, recommended) {
    const percentage = (consumed / recommended) * 100;
    if (percentage < 90) return "under";
    if (percentage > 110) return "over";
    return "on-track";
  }

  getAlcoholStatus(units, recommended) {
    if (units <= recommended) return "safe";
    if (units <= recommended * 1.5) return "elevated";
    return "high-risk";
  }

  getAlcoholWarning(units, recommended) {
    if (units > recommended * 1.5) {
      return "⚠️ Binge drinking detected. Increases health risks.";
    }
    if (units > recommended) {
      return "⚠️ Over safe weekly limit. Consider reducing.";
    }
    return null;
  }

  generateInsights(comparison) {
    const insights = [];

    if (comparison.calories.remaining > 500) {
      insights.push(`You have ${comparison.calories.remaining} calories remaining.`);
    } else if (comparison.calories.remaining < -200) {
      insights.push(`You're ${Math.abs(comparison.calories.remaining)} calories over.`);
    }

    if (comparison.protein.percentage < 80) {
      insights.push(`Protein is ${comparison.protein.percentage}% of goal. Add protein-rich foods.`);
    }

    if (comparison.sugar.percentage > 100) {
      insights.push(`Sugar intake is ${comparison.sugar.percentage}% of recommended. Try to reduce.`);
    }

    if (comparison.fiber.percentage < 80) {
      insights.push(`Fiber is ${comparison.fiber.percentage}% of goal. Add whole grains or vegetables.`);
    }

    if (comparison.alcohol.warning) {
      insights.push(comparison.alcohol.warning);
    }

    return insights;
  }

  getFoodsByName(searchTerm) {
    const term = searchTerm.toLowerCase();
    return Object.values(this.foods).filter(food =>
      food.name.toLowerCase().includes(term)
    );
  }

  getAllFoods() {
    return Object.values(this.foods);
  }

  removeMeal(mealId, date = null) {
    const targetDate = date || this.getToday();
    const log = this.dailyLog[targetDate];

    if (!log) return { error: "No meals logged for this date" };

    const index = log.meals.findIndex(m => m.id === mealId);
    if (index === -1) return { error: "Meal not found" };

    const removed = log.meals.splice(index, 1)[0];
    this.updateDailySummary(targetDate);

    return {
      success: true,
      removed: removed,
      dailySummary: this.getDailySummary(targetDate)
    };
  }

  getMealsForDate(date = null) {
    const targetDate = date || this.getToday();
    return this.dailyLog[targetDate] || {
      date: targetDate,
      meals: [],
      summary: this.initializeSummary()
    };
  }

  getCurrentTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  getToday() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  exportDailyLog(date = null) {
    const targetDate = date || this.getToday();
    return JSON.stringify(this.dailyLog[targetDate], null, 2);
  }

  clearDailyLog(date = null) {
    const targetDate = date || this.getToday();
    delete this.dailyLog[targetDate];
    return { success: true, message: `Cleared log for ${targetDate}` };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MealLogger;
}
