package com.shanescarcella.api.recipe;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record Ingredient(
    @NotBlank String foodId,
    @NotNull @Positive Double quantity,
    @NotBlank String unit
) {
}