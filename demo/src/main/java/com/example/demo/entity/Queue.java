package com.example.demo.entity;

import com.example.demo.domain.ChatMode;
import com.example.demo.domain.UserGender;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "queue")
@Data
public class Queue {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID queueId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserGender gender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChatMode chatMode;

    @CreationTimestamp
    private Instant enteredAt;
}
