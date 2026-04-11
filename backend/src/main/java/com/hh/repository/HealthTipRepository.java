package com.hh.repository;

import com.hh.entity.HealthTip;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HealthTipRepository extends JpaRepository<HealthTip, Long> {
    List<HealthTip> findTop3ByOrderByDateDesc();
}