package com.hh.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "health_tips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HealthTip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String category;
    @Column(length = 50)
    private String icon;
    private LocalDate date = LocalDate.now();
}