package com.shanescarcella.api.dailylog;

import java.time.LocalDate;

// This record will hold the entry and the date from the client
public record AddEntryRequest(Entry entry, String date) {
}