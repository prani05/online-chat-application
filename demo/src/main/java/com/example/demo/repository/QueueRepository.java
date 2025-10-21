package com.example.demo.repository;

import com.example.demo.domain.ChatMode;
import com.example.demo.domain.UserGender;
import com.example.demo.entity.Queue;
import com.example.demo.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface QueueRepository extends JpaRepository<Queue, UUID> {

    // Spring Data JPA magic: This method name is automatically turned into a SQL query.
    // It finds the first person in the queue with a different gender and same chat mode.
    Optional<Queue> findFirstByGenderAndChatModeAndSession_SessionIdNotOrderByEnteredAtAsc(
            UserGender gender, ChatMode chatMode, UUID sessionId);

    // Finds a queue entry by the session object.
    Optional<Queue> findBySession(Session session);
}
