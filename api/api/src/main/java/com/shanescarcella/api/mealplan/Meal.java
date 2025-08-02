package com.shanescarcella.api.mealplan;

import com.shanescarcella.api.food.Food;
import java.util.List;

public record Meal(String name, List<Food> foods, double totalCalories) {
}