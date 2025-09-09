package com.shanescarcella.api.dailylog;

// This record will hold the entry and the date from the client
public record AddEntryRequest(Entry entry, String date) {
}