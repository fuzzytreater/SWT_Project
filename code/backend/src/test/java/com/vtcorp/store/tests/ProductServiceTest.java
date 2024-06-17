package com.vtcorp.store.tests;

import com.vtcorp.store.entities.Product;
import com.vtcorp.store.repositories.ProductRepository;
import com.vtcorp.store.services.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
public class ProductServiceTest {

    @MockBean
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    private List<Product> mockActiveProducts;
    private List<Product> mockAllProducts;
    private Product product1;
    private Product product2;
    private Product product3;
    private Product product4;

    @BeforeEach
    public void setUp() {
        // Mock data setup
        product1 = new Product();
        product1.setProductId(1L);
        product1.setName("Product 1");
        product1.setActive(true);

        product2 = new Product();
        product2.setProductId(2L);
        product2.setName("Product 2");
        product2.setActive(true);

        product3 = new Product();
        product3.setProductId(3L);
        product3.setName("Product 3");
        product3.setActive(false);

        product4 = new Product();
        product4.setProductId(4L);
        product4.setName("Product 4");
        product4.setActive(false);

    }

    @Test
    public void testGetActiveProducts_success() {
        // Only include active products in the mock return list
        mockActiveProducts = Arrays.asList(product1, product2);
        // Mocking repository method to return only active products
        when(productRepository.findByActive(true)).thenReturn(mockActiveProducts);

        // Call the service method
        List<Product> activeProducts = productService.getActiveProducts();

        // Assertions
        assertEquals(2, activeProducts.size()); // Expecting only 2 active product
        assertEquals("Product 1", activeProducts.get(0).getName()); // Ensure it's the correct active product
        assertEquals("Product 2", activeProducts.get(1).getName());
    }

    @Test
    public void testGetActiveProducts_NoActiveProducts() {
        // Only include active products in the mock return list
        mockActiveProducts = Arrays.asList();
        // Mocking repository method to return only active products
        when(productRepository.findByActive(true)).thenReturn(mockActiveProducts);

        // Call the service method
        List<Product> activeProducts = productService.getActiveProducts();

        // Assertions
        assertEquals(0, activeProducts.size()); // Expecting  0 active product

    }

    @Test
    public void testGetAllProducts_success() {
        // All products in the mock return list
        mockAllProducts = Arrays.asList(product1, product2, product3, product4);
        // Mocking repository method to return all products
        when(productRepository.findAll()).thenReturn(mockAllProducts);
        // Call the service method
        List<Product> allProducts = productService.getAllProducts();

        // Check the result
        assertEquals(4, allProducts.size()); // Expect to have 3 products in the returned list
        assertEquals("Product 1", allProducts.get(0).getName());
        assertEquals("Product 2", allProducts.get(1).getName());
        assertEquals("Product 3", allProducts.get(2).getName());
        assertEquals("Product 4", allProducts.get(3).getName());
    }

    @Test
    public void testGetAllProducts_EmptyProductList() {
        // All products in the mock return list
        mockAllProducts = Arrays.asList();
        // Mocking repository method to return all products
        when(productRepository.findAll()).thenReturn(mockAllProducts);
        // Call the service method
        List<Product> allProducts = productService.getAllProducts();

        // Check the result
        assertEquals(0, allProducts.size()); // Expect to have 0 products in the returned list

    }

}
