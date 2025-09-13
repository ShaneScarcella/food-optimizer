package com.shanescarcella.api.recipe;

import com.shanescarcella.api.user.User;
import com.shanescarcella.api.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Recipe> createRecipe(@Valid @RequestBody Recipe recipe, Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        Recipe createdRecipe = recipeService.createRecipe(recipe, user);
        
        return new ResponseEntity<>(createdRecipe, HttpStatus.CREATED);
    }
}