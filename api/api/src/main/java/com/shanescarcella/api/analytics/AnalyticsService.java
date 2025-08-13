package com.shanescarcella.api.analytics;

import com.shanescarcella.api.dailylog.DailyLog;
import com.shanescarcella.api.dailylog.DailyLogRepository;
import com.shanescarcella.api.dailylog.Entry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final DailyLogRepository dailyLogRepository;

    public double getAverageDailyCalories(String userId) {
        List<DailyLog> logs = dailyLogRepository.findAllByUserId(userId);

        if (logs.isEmpty()) {
            return 0.0;
        }

        double totalCalories = 0;
        for (DailyLog log : logs) {
            for (Entry entry : log.getEntries()) {
                totalCalories += entry.calories();
            }
        }

        return totalCalories / logs.size();
    }
}