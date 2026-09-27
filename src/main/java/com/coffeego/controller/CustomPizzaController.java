package com.coffeego.controller;

import com.coffeego.dto.CustomPizzaRequest;
import com.coffeego.model.Cart;
import com.coffeego.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/custom-pizza")
public class CustomPizzaController {

    private final CartService cartService;

    public CustomPizzaController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/build")
    public ResponseEntity<Cart> buildCustomPizza(@Valid @RequestBody CustomPizzaRequest request) {
        double basePrice = 80.00; // Base crust price in INR (₹)
        
        // Crust pricing in INR
        if ("Stuffed Crust".equalsIgnoreCase(request.getCrust())) {
            basePrice += 30.00;
        } else if ("Gluten Free".equalsIgnoreCase(request.getCrust())) {
            basePrice += 40.00;
        } else if ("Deep Dish Pan".equalsIgnoreCase(request.getCrust())) {
            basePrice += 30.00;
        }

        // Base sauce pricing in INR
        if ("Basil Pesto".equalsIgnoreCase(request.getBase())) {
            basePrice += 25.00;
        } else if ("Creamy Garlic Parmesan".equalsIgnoreCase(request.getBase()) || "Smoky BBQ".equalsIgnoreCase(request.getBase())) {
            basePrice += 20.00;
        }

        // Ingredients / Toppings pricing in INR
        if (request.getIngredients() != null) {
            basePrice += request.getIngredients().size() * 25.00;
        }

        double finalPrice = Math.round(basePrice * 100.0) / 100.0;

        List<String> details = new ArrayList<>();
        details.add("Crust: " + request.getCrust());
        details.add("Base: " + request.getBase());
        if (request.getIngredients() != null && !request.getIngredients().isEmpty()) {
            details.add("Toppings: " + String.join(", ", request.getIngredients()));
        }

        String pizzaName = "Custom Pizza (" + request.getCrust() + ")";
        Cart updatedCart = cartService.addCustomPizza(pizzaName, finalPrice, request.getSize(), details);

        return ResponseEntity.ok(updatedCart);
    }
}
