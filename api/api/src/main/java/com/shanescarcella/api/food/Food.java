package com.shanescarcella.api.food;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document(collection = "foods")
public class Food {

    @Id
    private String id;

    @NotBlank(message = "Food name is required.")
    private String name;

    // Nutrition
    @NotNull(message = "Calories are required.")
    private Double calories;

    @NotNull(message = "Protein is required.")
    private Double protein;

    @NotNull(message = "Carbohydrates are required.")
    private Double carbs;

    @NotNull(message = "Fat is required.")
    private Double fat;

    // "100g", "1 cup", "1 piece"
    private String servingSize;
}