package com.shanescarcella.api.recipe;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends MongoRepository<Recipe, String> {

    // This will find all recipes created by a specific user
    List<Recipe> findByCreatedByUserId(String userId);

    // This will find all global recipes
    List<Recipe> findByCreatedByUserIdIsNull();
}