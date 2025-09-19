package com.shanescarcella.api.food;

import com.shanescarcella.api.user.User;
import com.shanescarcella.api.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;
    private final UserRepository userRepository;

    @GetMapping("/search")
    public ResponseEntity<List<Food>> searchFoods(Authentication authentication, @RequestParam String name) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        
        List<Food> foods = foodService.searchFoods(name, user.getId());
        return ResponseEntity.ok(foods);
    }

    @PostMapping
    public ResponseEntity<Food> createFood(Authentication authentication, @Valid @RequestBody CreateFoodRequest request) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        Food createdFood = foodService.createFood(request.food(), user.getId(), request.isPublic());
        return ResponseEntity.ok(createdFood);
    }

    @GetMapping("/pantry")
    public ResponseEntity<List<Food>> getPantryFoods(Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        
        if (user.getPantryItemIds() == null || user.getPantryItemIds().isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Food> pantryFoods = foodService.findFoodsByIds(user.getPantryItemIds());
        return ResponseEntity.ok(pantryFoods);
    }

    @GetMapping("/all-foods")
    public ResponseEntity<List<Food>> getAllUserFoods(Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        
        List<Food> foods = foodService.getAllFoodsForUser(user.getId());
        return ResponseEntity.ok(foods);
    }

    // Fetches foods that the user has specifically added to their "My Foods" list
    @GetMapping("/my-foods")
    public ResponseEntity<List<Food>> getMyFoods(Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (user.getMyFoodIds() == null || user.getMyFoodIds().isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Food> myFoods = foodService.findFoodsByIds(user.getMyFoodIds());
        return ResponseEntity.ok(myFoods);
    }
}