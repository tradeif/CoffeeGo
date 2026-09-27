package com.coffeego.controller;

import com.coffeego.model.Cart;
import com.coffeego.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<Cart> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addItem(@RequestBody Map<String, Object> payload) {
        String menuItemId = (String) payload.get("menuItemId");
        int quantity = payload.containsKey("quantity") ? ((Number) payload.get("quantity")).intValue() : 1;
        String size = (String) payload.getOrDefault("size", "Regular");
        @SuppressWarnings("unchecked")
        List<String> customizations = (List<String>) payload.get("customizations");

        Cart updated = cartService.addItem(menuItemId, quantity, size, customizations);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/item/{id}")
    public ResponseEntity<Cart> updateItem(@PathVariable String id, @RequestBody Map<String, Integer> payload) {
        int quantity = payload.getOrDefault("quantity", 1);
        Cart updated = cartService.updateQuantity(id, quantity);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/item/{id}")
    public ResponseEntity<Cart> removeItem(@PathVariable String id) {
        Cart updated = cartService.removeItem(id);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/coupon")
    public ResponseEntity<Cart> applyCoupon(@RequestBody Map<String, String> payload) {
        String code = payload.getOrDefault("code", "");
        Cart updated = cartService.applyCoupon(code);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping
    public ResponseEntity<Cart> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok(cartService.getCart());
    }
}
