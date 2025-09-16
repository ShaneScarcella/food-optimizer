package com.shanescarcella.api.recipe;

import com.shanescarcella.api.food.FoodRepository;
import com.shanescarcella.api.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final FoodRepository foodRepository;

    /**
     * Creates a new recipe and assigns it to the user.
     * It validates that all ingredients exist as Food items before saving.
     */
    public Recipe createRecipe(Recipe recipe, User user) {
        // Validate that all food items in the ingredients list exist.
        for (Ingredient ingredient : recipe.getIngredients()) {
            foodRepository.findById(ingredient.foodId())
                .orElseThrow(() -> new IllegalArgumentException("Food not found with id: " + ingredient.foodId()));
        }

        recipe.setCreatedByUserId(user.getId());
        return recipeRepository.save(recipe);
    }
}
