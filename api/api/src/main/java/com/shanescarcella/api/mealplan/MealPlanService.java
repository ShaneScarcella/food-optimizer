package com.shanescarcella.api.mealplan;

import com.shanescarcella.api.food.Food;
import com.shanescarcella.api.food.FoodRepository;
import com.shanescarcella.api.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MealPlanService {

    private final FoodRepository foodRepository;

    public WeeklyMealPlan generateWeeklyPlan(User user, MealPlanRequest request) {
        List<Food> allFoods = foodRepository.findAll();
        if (allFoods.isEmpty()) {
            return new WeeklyMealPlan(Collections.emptyList());
        }

        // Separate foods into two lists: pantry items and non-pantry items
        List<String> pantryItems = user.getPantryItems() != null ? user.getPantryItems() : Collections.emptyList();
        List<Food> pantryFoods = allFoods.stream()
                .filter(food -> pantryItems.stream().anyMatch(pantryItem -> food.getName().equalsIgnoreCase(pantryItem)))
                .collect(Collectors.toList());
        List<Food> otherFoods = allFoods.stream()
                .filter(food -> pantryFoods.stream().noneMatch(pantryFood -> pantryFood.getId().equals(food.getId())))
                .collect(Collectors.toList());

        List<DailyMealPlan> dailyPlans = new ArrayList<>();
        String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};

        for (String day : days) {
            List<Meal> meals = new ArrayList<>();
            double dailyCalorieTarget = user.getTargetCalories() > 0 ? user.getTargetCalories() : 2000.0;
            double caloriesPerMeal = dailyCalorieTarget / 3;

            for (String mealName : List.of("Breakfast", "Lunch", "Dinner")) {
                List<Food> mealFoods = new ArrayList<>();
                double currentMealCalories = 0;

                // Prioritize pantry foods, then add other foods
                Collections.shuffle(pantryFoods);
                for (Food food : pantryFoods) {
                    if (currentMealCalories + food.getCalories() <= caloriesPerMeal) {
                        mealFoods.add(food);
                        currentMealCalories += food.getCalories();
                    }
                }

                // Fill the rest with other foods if there's still room
                Collections.shuffle(otherFoods);
                for (Food food : otherFoods) {
                     if (currentMealCalories + food.getCalories() <= caloriesPerMeal) {
                        mealFoods.add(food);
                        currentMealCalories += food.getCalories();
                    }
                }

                meals.add(new Meal(mealName, mealFoods, currentMealCalories));
            }
            dailyPlans.add(new DailyMealPlan(day, meals));
        }

        return new WeeklyMealPlan(dailyPlans);
    }
}