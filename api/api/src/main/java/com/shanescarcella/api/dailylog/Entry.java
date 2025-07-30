package com.shanescarcella.api.dailylog;

public record Entry(String foodId, String name, Double servingQty, String servingSize, Double calories) {
}