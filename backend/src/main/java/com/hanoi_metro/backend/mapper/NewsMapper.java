package com.hanoi_metro.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.hanoi_metro.backend.dto.request.NewsCreationRequest;
import com.hanoi_metro.backend.dto.request.NewsUpdateRequest;
import com.hanoi_metro.backend.dto.response.NewsResponse;
import com.hanoi_metro.backend.entity.News;

@Mapper(componentModel = "spring")
public interface NewsMapper {

    @Mapping(target = "createdBy", source = "createdBy.fullName")
    NewsResponse toResponse(News news);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    News toNews(NewsCreationRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    void updateNews(@MappingTarget News news, NewsUpdateRequest request);
}
