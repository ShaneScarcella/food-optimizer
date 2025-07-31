package com.shanescarcella.api.dailylog;

import com.shanescarcella.api.user.User;
import com.shanescarcella.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class DailyLogController {

    private final DailyLogService dailyLogService;
    private final DailyLogRepository dailyLogRepository;
    private final UserRepository userRepository;

    @PostMapping("/entry")
    public ResponseEntity<DailyLog> addFoodEntry(Authentication authentication, @RequestBody Entry entry) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        DailyLog updatedLog = dailyLogService.addEntryToLog(user.getId(), entry);
        return ResponseEntity.ok(updatedLog);
    }

    @GetMapping
    public ResponseEntity<DailyLog> getLogForDate(Authentication authentication, @RequestParam String date) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        LocalDate localDate = LocalDate.parse(date); // Date in "YYYY-MM-DD" format
        Optional<DailyLog> dailyLog = dailyLogRepository.findByUserIdAndDate(user.getId(), localDate);

        return dailyLog.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}