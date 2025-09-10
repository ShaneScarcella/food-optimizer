package com.shanescarcella.api.food;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface FoodRepository extends MongoRepository<Food, String> {
    
    // Finds foods where the name contains the search term (case-insensitive)
    // and either createdByUserId matches the given userId or is null (public food)
    @Query("{ 'name': { '$regex': ?0, '$options': 'i' }, '$or': [ { 'createdByUserId': ?1 }, { 'createdByUserId': null } ] }")
    List<Food> findByNameContainingIgnoreCaseAndCreatedByUserIdOrCreatedByUserIdIsNull(String name, String userId);
}
