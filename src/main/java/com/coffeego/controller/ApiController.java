package com.coffeego.controller;

import com.coffeego.model.MenuItem;
import com.coffeego.model.Promotion;
import com.coffeego.model.Testimonial;
import com.coffeego.service.MenuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final MenuService menuService;

    public ApiController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/menu")
    public ResponseEntity<List<MenuItem>> getMenu(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(menuService.getMenuItemsByCategory(category));
    }

    @GetMapping("/bestsellers")
    public ResponseEntity<List<MenuItem>> getBestSellers() {
        return ResponseEntity.ok(menuService.getBestSellers());
    }

    @GetMapping("/promotions")
    public ResponseEntity<List<Promotion>> getPromotions() {
        return ResponseEntity.ok(menuService.getPromotions());
    }

    @GetMapping("/testimonials")
    public ResponseEntity<List<Testimonial>> getTestimonials() {
        return ResponseEntity.ok(menuService.getTestimonials());
    }
}
