package com.shanescarcella.api.analytics;

import com.shanescarcella.api.user.User;
import com.shanescarcella.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    @GetMapping("/average-calories")
    public ResponseEntity<Map<String, Double>> getAverageCalories(Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        double average = analyticsService.getAverageDailyCalories(user.getId());
        Map<String, Double> response = Map.of("averageDailyCalories", average);

        return ResponseEntity.ok(response);
    }
}