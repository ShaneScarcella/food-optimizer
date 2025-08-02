package com.shanescarcella.api.mealplan;

import com.shanescarcella.api.user.User;
import com.shanescarcella.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/meal-plans")
@RequiredArgsConstructor
public class MealPlanController {

    private final MealPlanService mealPlanService;
    private final UserRepository userRepository;

    @PostMapping("/generate")
    public ResponseEntity<WeeklyMealPlan> generateMealPlan(
            Authentication authentication,
            @RequestBody MealPlanRequest request) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        WeeklyMealPlan weeklyMealPlan = mealPlanService.generateWeeklyPlan(user, request);
        return ResponseEntity.ok(weeklyMealPlan);
    }
}