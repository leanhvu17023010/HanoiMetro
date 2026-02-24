package com.hanoi_metro.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NewsCreationRequest {
    @NotBlank(message = "TITLE_IS_REQUIRED")
    String title;

    String summary;

    @NotBlank(message = "CONTENT_IS_REQUIRED")
    String content;

    String imageUrl;

    @NotNull(message = "STATUS_IS_REQUIRED")
    Boolean status;
}
