package com.shanescarcella.api.metadata;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserFoodMetadataRepository extends MongoRepository<UserFoodMetadata, String> {

    // Find a specific metadata entry for a user and a food
    Optional<UserFoodMetadata> findByUserIdAndFoodId(String userId, String foodId);

    // Find all metadata entries for a given user
    List<UserFoodMetadata> findAllByUserId(String userId);
}