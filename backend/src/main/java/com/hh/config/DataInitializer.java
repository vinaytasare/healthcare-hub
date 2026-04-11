package com.hh.config;

import com.hh.entity.*;
import com.hh.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final HealthTipRepository healthTipRepository;

    @Override
    public void run(String... args) {

        // Seed roles
        if (roleRepository.findByName("USER").isEmpty()) {
            roleRepository.save(new Role(null, "USER"));
        }
        if (roleRepository.findByName("ADMIN").isEmpty()) {
            roleRepository.save(new Role(null, "ADMIN"));
        }

        // Seed admin user
        if (!userRepository.existsByEmail("admin@healthcarehub.com")) {
            Role adminRole = roleRepository.findByName("ADMIN").get();
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@healthcarehub.com");
            admin.setPassword(passwordEncoder.encode("Admin@12345"));
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
            System.out.println("✅ Admin user created: admin@healthcarehub.com / Admin@12345");
        }

        // Seed health tips
        if (healthTipRepository.count() == 0) {
            healthTipRepository.save(new HealthTip(null, "Stay Hydrated",
                    "Drink at least 8 glasses of water daily to maintain optimal body function and energy levels.",
                    "Hydration", "Water", LocalDate.now()));
            healthTipRepository.save(new HealthTip(null, "Exercise Daily",
                    "30 minutes of moderate exercise daily reduces risk of heart disease by up to 35%.",
                    "Fitness", "Run", LocalDate.now()));
            healthTipRepository.save(new HealthTip(null, "Sleep Well",
                    "Adults need 7-9 hours of quality sleep for proper immune function and mental health.",
                    "Sleep", "Sleep", LocalDate.now()));
            healthTipRepository.save(new HealthTip(null, "Eat Vegetables",
                    "Fill half your plate with vegetables and fruits to get essential vitamins and minerals.",
                    "Nutrition", "Food", LocalDate.now()));
            healthTipRepository.save(new HealthTip(null, "Manage Stress",
                    "Practice deep breathing or meditation for 10 minutes daily to reduce cortisol levels.",
                    "Mental Health", "Relax", LocalDate.now()));
            System.out.println("Health tips seeded");
        }
    }
}