package com.shanescarcella.api.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
}