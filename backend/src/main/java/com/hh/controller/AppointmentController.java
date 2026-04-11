package com.hh.controller;

import com.hh.entity.Appointment;
import com.hh.entity.User;
import com.hh.repository.AppointmentRepository;
import com.hh.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Appointment> book(
            @RequestBody Appointment appointment,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        appointment.setUser(user);
        appointment.setStatus(Appointment.Status.PENDING);
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(appointmentRepository.findByUserOrderByAppointmentDateDesc(user));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Map<String, String>> cancel(
            @PathVariable Long id,
            Authentication authentication) {
        Appointment apt = appointmentRepository.findById(id).orElseThrow();
        apt.setStatus(Appointment.Status.CANCELLED);
        appointmentRepository.save(apt);
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        appointmentRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Appointment deleted"));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> adminDelete(@PathVariable Long id) {
    appointmentRepository.deleteById(id);
    return ResponseEntity.ok(Map.of("message", "Appointment deleted"));
}
}