package com.shanescarcella.api.dailylog;

import lombok.RequiredArgsConstructor;

import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class DailyLogService {

    private final DailyLogRepository dailyLogRepository;

    public DailyLog addEntryToLog(String userId, Entry entry, LocalDate date) {
        // Creates new log if one does not exist for the user and date
        DailyLog dailyLog = dailyLogRepository.findByUserIdAndDate(userId, date)
                .orElseGet(() -> DailyLog.builder()
                        .userId(userId)
                        .date(date)
                        .entries(new ArrayList<>())
                        .build());

        dailyLog.getEntries().add(entry);

        return dailyLogRepository.save(dailyLog);
    }
}