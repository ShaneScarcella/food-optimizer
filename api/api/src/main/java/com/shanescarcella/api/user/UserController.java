package com.shanescarcella.api.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getLoggedInUserProfile(Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateUserProfile(Authentication authentication, @RequestBody User updatedUser) {
        String userEmail = authentication.getName();
        User savedUser = userService.updateUserProfile(userEmail, updatedUser);
        return ResponseEntity.ok(savedUser);
    }

    // Endpoint to add a food item to the user's personal collection
    @PostMapping("/me/my-foods")
    public ResponseEntity<User> addFoodToMyFoods(Authentication authentication, @RequestBody Map<String, String> payload) {
        String userEmail = authentication.getName();
        String foodId = payload.get("foodId");
        User updatedUser = userService.addFoodToMyFoods(userEmail, foodId);
        return ResponseEntity.ok(updatedUser);
    }


    // Endpoint to remove a food item from the user's personal collection
    @DeleteMapping("/me/my-foods/{foodId}")
    public ResponseEntity<User> removeFoodFromMyFoods(Authentication authentication, @PathVariable String foodId) {
        String userEmail = authentication.getName();
        User updatedUser = userService.removeFoodFromMyFoods(userEmail, foodId);
        return ResponseEntity.ok(updatedUser);
    }
}