package com.hanoi_metro.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hanoi_metro.backend.entity.News;

@Repository
public interface NewsRepository extends JpaRepository<News, String> {
    List<News> findAllByStatusOrderByCreatedAtDesc(Boolean status);

    List<News> findAllByOrderByCreatedAtDesc();
}
