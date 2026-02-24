package com.hanoi_metro.backend.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.hanoi_metro.backend.dto.request.ApiResponse;
import com.hanoi_metro.backend.dto.request.BannerCreationRequest;
import com.hanoi_metro.backend.dto.request.BannerUpdateRequest;
import com.hanoi_metro.backend.dto.response.BannerResponse;
import com.hanoi_metro.backend.service.BannerService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/banners")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BannerController {

    BannerService bannerService;

    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<BannerResponse> createBanner(
            @ModelAttribute @Valid BannerCreationRequest request,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) {
        log.info("Controller: create Banner with image");
        return ApiResponse.<BannerResponse>builder()
                .result(bannerService.createBanner(request, image))
                .build();
    }

    @GetMapping
    ApiResponse<List<BannerResponse>> getAllBanners() {
        return ApiResponse.<List<BannerResponse>>builder()
                .result(bannerService.getAllBanners())
                .build();
    }

    @GetMapping("/active")
    ApiResponse<List<BannerResponse>> getActiveBanners() {
        return ApiResponse.<List<BannerResponse>>builder()
                .result(bannerService.getActiveBanners())
                .build();
    }

    @GetMapping("/{bannerId}")
    ApiResponse<BannerResponse> getBannerById(@PathVariable String bannerId) {
        return ApiResponse.<BannerResponse>builder()
                .result(bannerService.getBannerById(bannerId))
                .build();
    }

    @PutMapping(value = "/{bannerId}", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<BannerResponse> updateBanner(
            @PathVariable String bannerId,
            @ModelAttribute @Valid BannerUpdateRequest request,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) {
        return ApiResponse.<BannerResponse>builder()
                .result(bannerService.updateBanner(bannerId, request, image))
                .build();
    }

    @PutMapping("/{bannerId}/order")
    ApiResponse<BannerResponse> updateBannerOrder(@PathVariable String bannerId, @RequestParam Integer orderIndex) {
        return ApiResponse.<BannerResponse>builder()
                .result(bannerService.updateBannerOrder(bannerId, orderIndex))
                .build();
    }

    @DeleteMapping("/{bannerId}")
    ApiResponse<String> deleteBanner(@PathVariable String bannerId) {
        bannerService.deleteBanner(bannerId);
        return ApiResponse.<String>builder().result("Banner has been deleted").build();
    }
}
