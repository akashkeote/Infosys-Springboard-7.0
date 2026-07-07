package com.example.backend.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SelfPingService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.self-ping.url:}")
    private String selfPingUrl;

    @Scheduled(cron = "0 0/14 * * * *")
    public void pingOwnApp() {
        if (selfPingUrl == null || selfPingUrl.isBlank()) {
            return;
        }

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(selfPingUrl, String.class);
            System.out.println("[SELF-PING] " + LocalDateTime.now() + " -> " + selfPingUrl + " | status="
                    + response.getStatusCode());
        } catch (Exception e) {
            System.out.println(
                    "[SELF-PING] " + LocalDateTime.now() + " -> " + selfPingUrl + " | failed: " + e.getMessage());
        }
    }
}