package com.coffeego.service;

import com.coffeego.dto.OrderRequest;
import com.coffeego.dto.OrderResponse;
import com.coffeego.model.Cart;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class OrderService {

    private final CartService cartService;
    private final Random random = new Random();

    public OrderService(CartService cartService) {
        this.cartService = cartService;
    }

    public OrderResponse placeOrder(OrderRequest request) {
        Cart cart = cartService.getCart();
        if (cart.getItems().isEmpty()) {
            return new OrderResponse(false, null, "EMPTY_CART", 0.0, 0,
                    "Your cart is empty. Please add delicious pizzas before ordering!");
        }

        String orderId = "CFG-" + (10000 + random.nextInt(90000));
        double finalTotal = cart.getTotal();

        // 30 minute guarantee!
        int deliveryMinutes = 30;

        // Clear cart after placing order
        cartService.clearCart();

        return new OrderResponse(true, orderId, "CONFIRMED", finalTotal, deliveryMinutes,
                "Order #" + orderId + " placed successfully! Our courier is speeding to " + request.getAddress() + " within our 30-minute guarantee!");
    }
}
