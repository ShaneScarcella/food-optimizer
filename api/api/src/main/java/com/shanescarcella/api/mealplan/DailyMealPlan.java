package com.shanescarcella.api.mealplan;

import java.util.List;

public record DailyMealPlan(String day, List<Meal> meals) {
}