package com.hh.controller;

import com.hh.entity.ChatHistory;
import com.hh.entity.User;
import com.hh.repository.ChatHistoryRepository;
import com.hh.repository.UserRepository;
import com.hh.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final GeminiService geminiService;
    private final ChatHistoryRepository chatHistoryRepository;
    private final UserRepository userRepository;

    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendMessage(
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        String userMessage = request.get("message");
        String botResponse = geminiService.chat(userMessage);

        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        ChatHistory history = new ChatHistory();
        history.setUser(user);
        history.setUserMessage(userMessage);
        history.setBotResponse(botResponse);
        chatHistoryRepository.save(history);

        return ResponseEntity.ok(Map.of("response", botResponse));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatHistory>> getHistory(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(chatHistoryRepository.findByUserOrderByTimestampDesc(user));
    }

    @DeleteMapping("/history/clear")
    public ResponseEntity<Map<String, String>> clearHistory(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        List<ChatHistory> history = chatHistoryRepository.findByUserOrderByTimestampDesc(user);
        chatHistoryRepository.deleteAll(history);
        return ResponseEntity.ok(Map.of("message", "Chat history cleared"));
    }
}