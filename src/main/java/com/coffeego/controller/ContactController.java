package com.coffeego.controller;

import com.coffeego.dto.ContactRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitContact(@Valid @RequestBody ContactRequest request) {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Thank you, " + request.getName() + "! Your message has been received. Our team will contact you shortly."
        ));
    }
}
