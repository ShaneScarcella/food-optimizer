package com.shanescarcella.api.metadata;

import com.shanescarcella.api.user.User;
import com.shanescarcella.api.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metadata")
@RequiredArgsConstructor
public class MetadataController {

    private final MetadataService metadataService;
    private final UserRepository userRepository;

    // Retrieve all metadata entries for the authenticated user
    @GetMapping
    public ResponseEntity<List<UserFoodMetadata>> getAllUserMetadata(Authentication authentication) {
        User user = getUser(authentication);
        List<UserFoodMetadata> metadata = metadataService.getAllMetadataForUser(user.getId());
        return ResponseEntity.ok(metadata);
    }

    // Upsert metadata for a specific food item for the authenticated user
    @PostMapping
    public ResponseEntity<UserFoodMetadata> upsertMetadata(Authentication authentication, @Valid @RequestBody UserFoodMetadata metadata) {
        User user = getUser(authentication);
        UserFoodMetadata savedMetadata = metadataService.upsertUserFoodMetadata(metadata, user);
        return ResponseEntity.ok(savedMetadata);
    }

    private User getUser(Authentication authentication) {
        String userEmail = authentication.getName();
        return userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }
}