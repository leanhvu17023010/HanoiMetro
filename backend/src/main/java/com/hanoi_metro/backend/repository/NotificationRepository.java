package com.hanoi_metro.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hanoi_metro.backend.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, String> {}
