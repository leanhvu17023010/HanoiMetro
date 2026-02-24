package com.hanoi_metro.backend.dto.response;

import java.time.LocalDateTime;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NewsResponse {
    String id;
    String title;
    String summary;
    String content;
    String imageUrl;
    Boolean status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    String createdBy; // Name or email
}
