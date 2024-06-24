package com.vtcorp.store.tests;

import com.vtcorp.store.dtos.ArticleResponseDTO;
import com.vtcorp.store.entities.Article;
import com.vtcorp.store.mappers.ArticleMapper;
import com.vtcorp.store.repositories.ArticleRepository;
import com.vtcorp.store.services.ArticleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@SpringBootTest
public class ArticleServiceTest {

    @Autowired
    private ArticleService articleService;

    @MockBean
    private ArticleRepository articleRepository;

    @MockBean
    private ArticleMapper articleMapper;

    Article article1;
    Article article2;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        article1 = new Article();
        article1.setArticleId(1L);
        article1.setTitle("Test Article 1");
        article1.setActive(true);
        article2 = new Article();
        article2.setArticleId(2L);
        article2.setTitle("Test Article 2");
        article2.setActive(true);
    }

    @Test
    public void testGetActiveArticles_success() {
        List<Article> articles = Arrays.asList(article1, article2);

        ArticleResponseDTO dto1 = new ArticleResponseDTO();
        dto1.setArticleId(1L);
        ArticleResponseDTO dto2 = new ArticleResponseDTO();
        dto2.setArticleId(2L);
        List<ArticleResponseDTO> dtos = Arrays.asList(dto1, dto2);

        when(articleRepository.findByActive(true)).thenReturn(articles);
        when(articleMapper.toResponseDTOs(articles)).thenReturn(dtos);

        List<ArticleResponseDTO> result = articleService.getActiveArticles();
        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getArticleId());
        assertEquals(2L, result.get(1).getArticleId());
    }

    @Test
    public void testGetActiveArticles_NoActiveArticles() {
        when(articleRepository.findByActive(true)).thenReturn(Collections.emptyList());
        when(articleMapper.toResponseDTOs(Collections.emptyList())).thenReturn(Collections.emptyList());

        List<ArticleResponseDTO> result = articleService.getActiveArticles();

        assertEquals(0, result.size());
    }

    @Test
    public void testGetArticleById_success() {
        Long articleId = 1L;

        ArticleResponseDTO responseDTO = new ArticleResponseDTO();
        responseDTO.setArticleId(articleId);
        responseDTO.setTitle("Test Article 1");

        when(articleRepository.findById(articleId)).thenReturn(Optional.of(article1));
        when(articleMapper.toResponseDTO(article1)).thenReturn(responseDTO);

        ArticleResponseDTO result = articleService.getArticleById(articleId);

        assertEquals(articleId, result.getArticleId());
        assertEquals("Test Article 1", result.getTitle());
    }

    @Test
    public void testGetArticleById_NotFound() {
        Long articleId = 10L;
        when(articleRepository.findById(articleId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            articleService.getArticleById(articleId);
        });

        assertEquals("Article not found", exception.getMessage());
    }


}
