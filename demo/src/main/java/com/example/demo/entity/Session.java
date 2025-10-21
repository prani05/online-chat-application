package com.example.demo.entity;

import com.example.demo.domain.SessionStatus;
import com.example.demo.domain.UserGender;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "sessions")
@Data // Lombok annotation for getters, setters, etc.
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID sessionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserGender userGender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserGender verifiedGender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status = SessionStatus.waiting;

    @Column(nullable = false)
    private String ipAddress;

    @Column(nullable = false)
    private String deviceId;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
