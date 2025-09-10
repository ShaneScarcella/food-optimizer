package com.shanescarcella.api.food;

// This DTO will carry the food data and the visibility choice from the client.
public record CreateFoodRequest(Food food, boolean isPublic) {
}
