package com.shanescarcella.api.food;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FoodRepository extends MongoRepository<Food, String> {
    List<Food> findByNameContainingIgnoreCase(String name);
}