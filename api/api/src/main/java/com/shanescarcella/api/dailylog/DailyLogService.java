package com.shanescarcella.api.dailylog;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class DailyLogService {

    private final DailyLogRepository dailyLogRepository;

    public DailyLog addEntryToLog(String userId, Entry entry) {
        LocalDate today = LocalDate.now();

        // Creates new log if one does not exist for the user and date
        DailyLog dailyLog = dailyLogRepository.findByUserIdAndDate(userId, today)
                .orElseGet(() -> DailyLog.builder()
                        .userId(userId)
                        .date(today)
                        .entries(new ArrayList<>())
                        .build());

        dailyLog.getEntries().add(entry);

        return dailyLogRepository.save(dailyLog);
    }
}