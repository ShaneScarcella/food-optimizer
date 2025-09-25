package com.shanescarcella.api.food;

import com.shanescarcella.api.user.User;
import com.shanescarcella.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodRepository foodRepository;
    private final UserRepository userRepository;

    public Food createFood(Food food, String userId, boolean isPublic) {
        if (!isPublic) {
            food.setCreatedByUserId(userId);
        }
        return foodRepository.save(food);
    }

    // Copy-on-edit logic
    @Transactional // Ensures all database operations in this method succeed or fail together
    public Food updateFood(String foodId, Food updatedFood, User user) {
        Food existingFood = foodRepository.findById(foodId)
            .orElseThrow(() -> new IllegalArgumentException("Food not found with id: " + foodId));

        // User is editing their own personal food.
        if (Objects.equals(existingFood.getCreatedByUserId(), user.getId())) {
            updatedFood.setId(existingFood.getId()); // Ensure the ID is preserved
            updatedFood.setCreatedByUserId(user.getId()); // Maintain ownership
            return foodRepository.save(updatedFood);
        }
        // User is editing a global food (or someone else's public food).
        else {
            // Create a new Food object, effectively copying it.
            updatedFood.setId(null);
            updatedFood.setCreatedByUserId(user.getId());
            Food newPersonalFood = foodRepository.save(updatedFood);

            // Update the user's "myFoodIds" list to replace the old global ID with the new personal one
            user.getMyFoodIds().remove(foodId);
            user.getMyFoodIds().add(newPersonalFood.getId());
            userRepository.save(user);

            return newPersonalFood;
        }
    }

    public List<Food> searchFoods(String name, String userId) {
        return foodRepository.findByNameContainingIgnoreCaseAndCreatedByUserIdIsNullOrCreatedByUserId(name, userId);
    }

    public List<Food> findFoodsByIds(List<String> foodIds) {
        return foodRepository.findAllById(foodIds);
    }

    public List<Food> getAllFoodsForUser(String userId) {
        return foodRepository.findAllByUserIdOrGlobal(userId);
    }
}