package com.shanescarcella.api.mealplan;

import com.shanescarcella.api.food.Food;
import com.shanescarcella.api.food.FoodRepository;
import com.shanescarcella.api.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MealPlanService {

    private final FoodRepository foodRepository;

    public WeeklyMealPlan generateWeeklyPlan(User user, MealPlanRequest request) {
        List<Food> allFoods = foodRepository.findAll();
        if (allFoods.isEmpty()) {
            return new WeeklyMealPlan(Collections.emptyList());
        }

        List<DailyMealPlan> dailyPlans = new ArrayList<>();
        String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};

        for (String day : days) {
            // 3 meals a day (change later if needed)
            List<Meal> meals = new ArrayList<>();
            double dailyCalorieTarget = user.getTargetCalories() > 0 ? user.getTargetCalories() : 2000.0;
            double caloriesPerMeal = dailyCalorieTarget / 3;

            for (String mealName : List.of("Breakfast", "Lunch", "Dinner")) {
                List<Food> mealFoods = new ArrayList<>();
                double currentMealCalories = 0;

                // Current approach: add random foods until we're close to the meal target
                Collections.shuffle(allFoods); // Randomize food order
                for (Food food : allFoods) {
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