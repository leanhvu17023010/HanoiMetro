package com.hanoi_metro.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hanoi_metro.backend.dto.request.NewsCreationRequest;
import com.hanoi_metro.backend.dto.request.NewsUpdateRequest;
import com.hanoi_metro.backend.dto.response.NewsResponse;
import com.hanoi_metro.backend.entity.News;
import com.hanoi_metro.backend.entity.User;
import com.hanoi_metro.backend.exception.AppException;
import com.hanoi_metro.backend.exception.ErrorCode;
import com.hanoi_metro.backend.mapper.NewsMapper;
import com.hanoi_metro.backend.repository.NewsRepository;
import com.hanoi_metro.backend.repository.UserRepository;
import com.hanoi_metro.backend.util.SecurityUtil;
import org.springframework.web.multipart.MultipartFile;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class NewsService {

    NewsRepository newsRepository;
    UserRepository userRepository;
    NewsMapper newsMapper;
    FileStorageService fileStorageService;

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public NewsResponse createNews(NewsCreationRequest request, MultipartFile imageFile) {
        String userEmail = SecurityUtil.getCurrentUserEmail();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        News news = newsMapper.toNews(request);

        // Handle image upload if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = fileStorageService.storeNewsMedia(imageFile);
            news.setImageUrl(imageUrl);
        }

        news.setCreatedBy(user);
        news.setCreatedAt(LocalDateTime.now());
        news.setUpdatedAt(LocalDateTime.now());

        News savedNews = newsRepository.save(news);
        log.info("News created with ID: {} by user: {}", savedNews.getId(), userEmail);

        return newsMapper.toResponse(savedNews);
    }

    public NewsResponse getNewsById(String id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_EXISTED));
        return newsMapper.toResponse(news);
    }

    public List<NewsResponse> getAllNews() {
        return newsRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(newsMapper::toResponse)
                .toList();
    }

    public List<NewsResponse> getActiveNews() {
        return newsRepository.findAllByStatusOrderByCreatedAtDesc(true).stream()
                .map(newsMapper::toResponse)
                .toList();
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public NewsResponse updateNews(String id, NewsUpdateRequest request, MultipartFile imageFile) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_EXISTED));

        newsMapper.updateNews(news, request);

        // Handle image upload if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = fileStorageService.storeNewsMedia(imageFile);
            news.setImageUrl(imageUrl);
        }

        news.setUpdatedAt(LocalDateTime.now());

        News savedNews = newsRepository.save(news);
        log.info("News updated with ID: {}", id);

        return newsMapper.toResponse(savedNews);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public void deleteNews(String id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_EXISTED));
        newsRepository.delete(news);
        log.info("News deleted with ID: {}", id);
    }
}
