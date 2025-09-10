package com.shanescarcella.api.food;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodRepository foodRepository;

    public Food createFood(Food food, String userId, boolean isPublic) {
        if (!isPublic) {
            food.setCreatedByUserId(userId);
        }
        // If it is public, createdByUserId remains null
        return foodRepository.save(food);
    }

    public List<Food> searchFoodByName(String name, String userId) {
        // Find foods where the name matches AND (the food is global OR created by the current user)
        return foodRepository.findByNameContainingIgnoreCaseAndCreatedByUserIdOrCreatedByUserIdIsNull(name, userId);
    }
}