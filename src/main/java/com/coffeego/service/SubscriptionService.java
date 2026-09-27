package com.coffeego.service;

import com.coffeego.dto.SubscribeResponse;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SubscriptionService {

    private final Set<String> subscribers = ConcurrentHashMap.newKeySet();

    public SubscribeResponse subscribe(String email) {
        String cleaned = email.trim().toLowerCase();
        if (subscribers.contains(cleaned)) {
            return new SubscribeResponse(true,
                    "You are already subscribed! Use your discount code COFFEEGO10 for 10% off.",
                    "COFFEEGO10", 10);
        }
        subscribers.add(cleaned);
        return new SubscribeResponse(true,
                "Welcome to Coffee Go! Your 10% discount coupon code is COFFEEGO10.",
                "COFFEEGO10", 10);
    }

    public int getSubscriberCount() {
        return subscribers.size();
    }
}
