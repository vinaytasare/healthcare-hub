package com.hh.repository;

import com.hh.entity.Appointment;
import com.hh.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserOrderByAppointmentDateDesc(User user);
    List<Appointment> findAllByOrderByAppointmentDateDesc();
}