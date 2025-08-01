package com.shanescarcella.api.pantry;

import com.shanescarcella.api.user.User;
import com.shanescarcella.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pantry")
@RequiredArgsConstructor
public class PantryController {

    private final UserRepository userRepository;

    @PutMapping
    public ResponseEntity<User> updateUserPantry(Authentication authentication, @RequestBody List<String> pantryItems) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        user.setPantryItems(pantryItems);
        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(updatedUser);
    }
}