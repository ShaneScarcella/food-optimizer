package com.shanescarcella.api.metadata;

import com.shanescarcella.api.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MetadataService {

    private final UserFoodMetadataRepository metadataRepository;

    // Retrieve all metadata entries for a specific user
    public List<UserFoodMetadata> getAllMetadataForUser(String userId) {
        return metadataRepository.findAllByUserId(userId);
    }

    // Update or insert (upsert) metadata for a specific user and food
    public UserFoodMetadata upsertUserFoodMetadata(UserFoodMetadata metadata, User user) {
        // Find if metadata already exists for this user and food combination
        Optional<UserFoodMetadata> existingMetadataOpt = metadataRepository.findByUserIdAndFoodId(user.getId(), metadata.getFoodId());

        if (existingMetadataOpt.isPresent()) {
            // If it exists, update the existing entry
            UserFoodMetadata existingMetadata = existingMetadataOpt.get();
            existingMetadata.setPreferredStore(metadata.getPreferredStore());
            existingMetadata.setLastPrice(metadata.getLastPrice());
            existingMetadata.setUserNotes(metadata.getUserNotes());
            return metadataRepository.save(existingMetadata);
        } else {
            // If it doesn't exist, set the userId and save the new entry
            metadata.setUserId(user.getId());
            return metadataRepository.save(metadata);
        }
    }
}