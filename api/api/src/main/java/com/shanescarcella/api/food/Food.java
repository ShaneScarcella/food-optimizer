package com.shanescarcella.api.food;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "foods")
public class Food {

    @Id
    private String id;

    @NotBlank(message = "Food name is required.")
    private String name;
    
    private String brand;

    @NotNull(message = "Calories are required.")
    private Double calories;

    @NotNull(message = "Protein is required.")
    private Double protein;

    @NotNull(message = "Carbohydrates are required.")
    private Double carbs;

    @NotNull(message = "Fat is required.")
    private Double fat;

    // e.g., "100g", "1 cup", "1 piece"
    private String servingSize;

    // Null for global, userId for personal
    private String createdByUserId;

    // Optional Extra Information
    private Double fiber;
    private Double sugar;
    private Double saturatedFat;
    private Double sodium; // in mg
    private Double potassium; // in mg
    private Double calcium; // in mg
    private Double iron; // in mg
    private Double vitaminC; // in mg
    private Double vitaminD; // in IU
}