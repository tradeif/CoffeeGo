package com.coffeego.service;

import com.coffeego.model.Cart;
import com.coffeego.model.CartItem;
import com.coffeego.model.MenuItem;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CartService {

    private final MenuService menuService;
    private final Cart cart = new Cart();

    public CartService(MenuService menuService) {
        this.menuService = menuService;
    }

    public synchronized Cart getCart() {
        return cart;
    }

    public synchronized Cart addItem(String menuItemId, int quantity, String size, List<String> customizations) {
        if (quantity <= 0) quantity = 1;
        Optional<MenuItem> itemOpt = menuService.getMenuItemById(menuItemId);
        if (itemOpt.isPresent()) {
            MenuItem item = itemOpt.get();
            double unitPrice = item.getPrice();
            if (size != null && item.getSizePrices() != null) {
                for (java.util.Map.Entry<String, Double> entry : item.getSizePrices().entrySet()) {
                    if (entry.getKey().equalsIgnoreCase(size)) {
                        unitPrice = entry.getValue();
                        break;
                    }
                }
            }
            final String finalSize = size != null ? size : "Regular";
            // Check if already in cart with same size
            Optional<CartItem> existing = cart.getItems().stream()
                    .filter(ci -> ci.getMenuItemId().equals(menuItemId) &&
                            finalSize.equalsIgnoreCase(ci.getSize()))
                    .findFirst();

            if (existing.isPresent()) {
                existing.get().setQuantity(existing.get().getQuantity() + quantity);
            } else {
                String id = UUID.randomUUID().toString();
                CartItem newItem = new CartItem(id, item.getId(), item.getName(),
                        unitPrice, quantity, finalSize,
                        item.getImageUrl(), customizations != null ? customizations : new ArrayList<>());
                cart.getItems().add(newItem);
            }
            cart.recalculate();
        }
        return cart;
    }

    public synchronized Cart addCustomPizza(String name, double price, String size, List<String> customizations) {
        String id = UUID.randomUUID().toString();
        CartItem newItem = new CartItem(id, "custom-pizza", name,
                price, 1, size,
                "/images/promo_custom_pizza.jpg", customizations);
        cart.getItems().add(newItem);
        cart.recalculate();
        return cart;
    }

    public synchronized Cart updateQuantity(String cartItemId, int quantity) {
        if (quantity <= 0) {
            return removeItem(cartItemId);
        }
        cart.getItems().stream()
                .filter(ci -> ci.getId().equals(cartItemId))
                .findFirst()
                .ifPresent(ci -> ci.setQuantity(quantity));
        cart.recalculate();
        return cart;
    }

    public synchronized Cart removeItem(String cartItemId) {
        cart.getItems().removeIf(ci -> ci.getId().equals(cartItemId));
        cart.recalculate();
        return cart;
    }

    public synchronized Cart applyCoupon(String code) {
        cart.setDiscountCode(code);
        cart.recalculate();
        return cart;
    }

    public synchronized void clearCart() {
        cart.getItems().clear();
        cart.setDiscountCode(null);
        cart.recalculate();
    }
}
