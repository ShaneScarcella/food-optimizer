package com.shanescarcella.api.dailylog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "daily_logs")
public class DailyLog {

    @Id
    private String id;
    private String userId;
    private LocalDate date;
    private List<Entry> entries;
}