package com.shanescarcella.api.dailylog;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyLogRepository extends MongoRepository<DailyLog, String> {
    Optional<DailyLog> findByUserIdAndDate(String userId, LocalDate date);
    List<DailyLog> findAllByUserId(String userId);
}