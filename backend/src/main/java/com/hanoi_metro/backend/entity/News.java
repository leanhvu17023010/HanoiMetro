package com.hanoi_metro.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "news")
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "title", nullable = false)
    String title;

    @Column(name = "summary", columnDefinition = "TEXT")
    String summary;

    @Column(name = "content", columnDefinition = "TEXT")
    String content;

    @Column(name = "image_url")
    String imageUrl;

    @Column(name = "status", nullable = false)
    Boolean status;

    @Column(name = "created_at", nullable = false)
    LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    User createdBy;
}
