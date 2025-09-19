package com.shanescarcella.api.food;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface FoodRepository extends MongoRepository<Food, String> {
    
    // Custom query to search foods by name (case-insensitive) and filter by user ID or global foods
    @Query("{ 'name': { '$regex': ?0, '$options': 'i' }, '$or': [ { 'createdByUserId': ?1 }, { 'createdByUserId': null } ] }")
    List<Food> findByNameContainingIgnoreCaseAndCreatedByUserIdIsNullOrCreatedByUserId(String name, String userId);

    // Custom query to find foods created by the user or global foods
    @Query("{'$or': [ { 'createdByUserId': ?0 }, { 'createdByUserId': null } ] }")
    List<Food> findAllByUserIdOrGlobal(String userId);
}