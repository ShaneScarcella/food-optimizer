// api/api/src/main/java/com/shanescarcella/api/food/FoodRepository.java

package com.shanescarcella.api.food;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface FoodRepository extends MongoRepository<Food, String> {
    
    @Query("{ 'name': { '$regex': ?0, '$options': 'i' }, '$or': [ { 'createdByUserId': ?1 }, { 'createdByUserId': null } ] }")
    List<Food> findByNameContainingIgnoreCaseAndCreatedByUserIdIsNullOrCreatedByUserId(String name, String userId);
}