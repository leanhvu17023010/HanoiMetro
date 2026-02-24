package com.hanoi_metro.backend.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.hanoi_metro.backend.dto.request.ApiResponse;
import com.hanoi_metro.backend.dto.request.NewsCreationRequest;
import com.hanoi_metro.backend.dto.request.NewsUpdateRequest;
import com.hanoi_metro.backend.dto.response.NewsResponse;
import com.hanoi_metro.backend.service.NewsService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class NewsController {

    NewsService newsService;

    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<NewsResponse> createNews(
            @ModelAttribute @Valid NewsCreationRequest request,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) {
        return ApiResponse.<NewsResponse>builder()
                .result(newsService.createNews(request, image))
                .build();
    }

    @GetMapping
    public ApiResponse<List<NewsResponse>> getAllNews() {
        return ApiResponse.<List<NewsResponse>>builder()
                .result(newsService.getAllNews())
                .build();
    }

    @GetMapping("/active")
    public ApiResponse<List<NewsResponse>> getActiveNews() {
        return ApiResponse.<List<NewsResponse>>builder()
                .result(newsService.getActiveNews())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<NewsResponse> getNewsById(@PathVariable String id) {
        return ApiResponse.<NewsResponse>builder()
                .result(newsService.getNewsById(id))
                .build();
    }

    @PutMapping(value = "/{id}", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<NewsResponse> updateNews(@PathVariable String id,
            @ModelAttribute @Valid NewsUpdateRequest request,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) {
        return ApiResponse.<NewsResponse>builder()
                .result(newsService.updateNews(id, request, image))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteNews(@PathVariable String id) {
        newsService.deleteNews(id);
        return ApiResponse.<Void>builder()
                .message("News has been deleted")
                .build();
    }
}
