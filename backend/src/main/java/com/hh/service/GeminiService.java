package com.hh.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String chat(String userMessage) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", "You are a strict healthcare assistant. ONLY answer questions related to health, medicine, symptoms, diseases, nutrition, fitness, mental health, medications, and medical advice. If the user asks anything not related to healthcare, politely refuse and say: 'I can only assist with health-related questions. Please ask me about symptoms, medications, nutrition, fitness, or any medical topic.' User asks: " + userMessage)
                ))
            )
        );

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            Map body = response.getBody();
            List candidates = (List) body.get("candidates");
            Map candidate = (Map) candidates.get(0);
            Map content = (Map) candidate.get("content");
            List parts = (List) content.get("parts");
            Map part = (Map) parts.get(0);
            return (String) part.get("text");

        } catch (Exception e) {
            System.out.println("Gemini Error: " + e.getMessage());
            if (e.getMessage() != null && e.getMessage().contains("429")) {
                return "I'm receiving too many requests. Please wait a moment and try again.";
            }
            return "Sorry, I couldn't process your request. Please try again.";
        }
    }
}