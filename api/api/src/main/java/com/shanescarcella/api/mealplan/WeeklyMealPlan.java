package com.shanescarcella.api.mealplan;

import java.util.List;

public record WeeklyMealPlan(List<DailyMealPlan> dailyPlans) {
}