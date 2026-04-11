package com.hh.controller;

import com.hh.entity.HealthTip;
import com.hh.repository.HealthTipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tips")
@RequiredArgsConstructor
public class HealthTipController {

    private final HealthTipRepository healthTipRepository;

    @GetMapping
    public ResponseEntity<List<HealthTip>> getTips() {
        return ResponseEntity.ok(healthTipRepository.findTop3ByOrderByDateDesc());
    }
}