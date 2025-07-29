package com.shanescarcella.api.food;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @GetMapping("/search")
    public ResponseEntity<List<Food>> searchFoods(@RequestParam String name) {
        List<Food> foods = foodService.searchFoodByName(name);
        return ResponseEntity.ok(foods);
    }

    @PostMapping
    public ResponseEntity<Food> createFood(@Valid @RequestBody Food food) {
        Food createdFood = foodService.createFood(food);
        return ResponseEntity.ok(createdFood);
    }
}