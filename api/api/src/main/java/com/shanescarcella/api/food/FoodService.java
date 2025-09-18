// api/api/src/main/java/com/shanescarcella/api/food/FoodService.java

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
        return foodRepository.save(food);
    }

    public List<Food> searchFoods(String name, String userId) {
        return foodRepository.findByNameContainingIgnoreCaseAndCreatedByUserIdIsNullOrCreatedByUserId(name, userId);
    }

    public List<Food> findFoodsByIds(List<String> foodIds) {
        return foodRepository.findAllById(foodIds);
    }
}