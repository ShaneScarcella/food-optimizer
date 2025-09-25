package com.shanescarcella.api.recipe;

import com.shanescarcella.api.food.FoodRepository;
import com.shanescarcella.api.user.User;
import com.shanescarcella.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;


@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final FoodRepository foodRepository;
    private final UserRepository userRepository;

    // Create a new recipe
    public Recipe createRecipe(Recipe recipe, User user) {
        // Validate that all food items in the ingredients list exist.
        for (Ingredient ingredient : recipe.getIngredients()) {
            foodRepository.findById(ingredient.foodId())
                .orElseThrow(() -> new IllegalArgumentException("Food not found with id: " + ingredient.foodId()));
        }

        recipe.setCreatedByUserId(user.getId());
        return recipeRepository.save(recipe);
    }

    // Update an existing recipe
    @Transactional
    public Recipe updateRecipe(String recipeId, Recipe updatedRecipe, User user) {
        Recipe existingRecipe = recipeRepository.findById(recipeId)
            .orElseThrow(() -> new IllegalArgumentException("Recipe not found with id: " + recipeId));

        // User is editing their own personal recipe.
        if (Objects.equals(existingRecipe.getCreatedByUserId(), user.getId())) {
            updatedRecipe.setId(existingRecipe.getId());
            updatedRecipe.setCreatedByUserId(user.getId());
            return recipeRepository.save(updatedRecipe);
        }
        // User is editing a global recipe.
        else {
            updatedRecipe.setId(null); // Create a new recipe
            updatedRecipe.setCreatedByUserId(user.getId());
            Recipe newPersonalRecipe = recipeRepository.save(updatedRecipe);

            user.getMyRecipeIds().remove(recipeId);
            user.getMyRecipeIds().add(newPersonalRecipe.getId());
            userRepository.save(user);

            return newPersonalRecipe;
        }
    }
}
