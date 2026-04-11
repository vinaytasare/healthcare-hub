package com.hh.controller;

import com.hh.entity.User;
import com.hh.repository.ChatHistoryRepository;
import com.hh.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final ChatHistoryRepository chatHistoryRepository;
    private final com.hh.repository.AppointmentRepository appointmentRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        long totalUsers = userRepository.count();
        long totalChats = chatHistoryRepository.count();
        return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "totalChats", totalChats));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/toggle")
    public ResponseEntity<Map<String, String>> toggleUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of(
                "message", "User " + (user.isEnabled() ? "enabled" : "disabled")));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<com.hh.entity.Appointment>> getAllAppointments() {
        return ResponseEntity.ok(
                appointmentRepository.findAllByOrderByAppointmentDateDesc());
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<Map<String, String>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        com.hh.entity.Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        apt.setStatus(com.hh.entity.Appointment.Status.valueOf(body.get("status")));
        appointmentRepository.save(apt);
        return ResponseEntity.ok(Map.of("message", "Status updated"));
    }
}