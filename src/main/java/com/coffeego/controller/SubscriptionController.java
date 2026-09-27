package com.coffeego.controller;

import com.coffeego.dto.SubscribeRequest;
import com.coffeego.dto.SubscribeResponse;
import com.coffeego.service.SubscriptionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<SubscribeResponse> subscribe(@Valid @RequestBody SubscribeRequest request) {
        SubscribeResponse response = subscriptionService.subscribe(request.getEmail());
        return ResponseEntity.ok(response);
    }
}
