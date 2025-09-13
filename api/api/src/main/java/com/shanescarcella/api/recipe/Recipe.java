package com.shanescarcella.api.recipe;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@Document(collection = "recipes")
public class Recipe {

    @Id
    private String id;

    @NotBlank(message = "Recipe name is required.")
    private String name;

    private String description;

    private String createdByUserId;

    @NotNull(message = "Ingredients are required.")
    @Size(min = 1, message = "A recipe must have at least one ingredient.")
    @Valid // Validate each Ingredient in the list
    private List<Ingredient> ingredients;

    private String instructions;
    
    private double servings;
}