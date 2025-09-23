package com.shanescarcella.api.metadata;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_food_metadata")
@CompoundIndex(name = "user_food_idx", def = "{'userId': 1, 'foodId': 1}", unique = true)
public class UserFoodMetadata {

    @Id
    private String id;

    private String userId;
    private String foodId;

    // User-specific, optional fields
    private String preferredStore;
    private Double lastPrice;
    private String userNotes;
}