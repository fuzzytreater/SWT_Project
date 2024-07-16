package com.vtcorp.store.controllers;

import com.fasterxml.jackson.annotation.JsonView;
import com.vtcorp.store.dtos.CartItemDTO;
import com.vtcorp.store.jsonview.Views;
import com.vtcorp.store.services.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final OrderService orderService;

    public CartController(OrderService orderService) {
        this.orderService = orderService;
    }

    @Operation(summary = "Get cart")
    @GetMapping
    @JsonView(Views.Cart.class)
    public ResponseEntity<?> getCart(Authentication authentication) {
        try {
            String username = authentication.getName();
            return ResponseEntity.ok(orderService.getCart(username));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

//    @Operation(summary = "Add item to cart", description = "Item type: 'product' or 'gift'")
//    @PutMapping("/add-item")
//    @JsonView(Views.Cart.class)
//    public ResponseEntity<?> addItemToCart(@RequestBody CartItemDTO cartItemDTO, Authentication authentication) {
//        try {
//            String username = authentication.getName();
//            return ResponseEntity.ok(orderService.addItemToCart(username, cartItemDTO));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }

    @Operation(summary = "Remove item from cart", description = "Item type: 'product' or 'gift'")
    @PutMapping("/remove-item")
    @JsonView(Views.Cart.class)
    public ResponseEntity<?> removeItemFromCart(@RequestBody CartItemDTO cartItemDTO, Authentication authentication) {
        try {
            String username = authentication.getName();
            return ResponseEntity.ok(orderService.removeItemFromCart(username, cartItemDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Update item in cart", description = "Item type: 'product' or 'gift'")
    @PutMapping("/update-item")
    @JsonView(Views.Cart.class)
    public ResponseEntity<?> updateItemInCart(@RequestBody CartItemDTO cartItemDTO, Authentication authentication) {
        try {
            String username = authentication.getName();
            return ResponseEntity.ok(orderService.updateItemInCart(username, cartItemDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
