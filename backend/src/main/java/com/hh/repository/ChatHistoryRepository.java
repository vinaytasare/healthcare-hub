package com.hh.repository;

import com.hh.entity.ChatHistory;
import com.hh.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    List<ChatHistory> findByUserOrderByTimestampDesc(User user);
}