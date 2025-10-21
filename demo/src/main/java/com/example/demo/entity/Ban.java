package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "bans")
@Data
public class Ban {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID banId;

    @JdbcTypeCode(SqlTypes.INET)
    private String ipAddress;

    // Note: CIDR type might require a custom UserType for full functionality.
    // Storing as String is a simpler alternative if advanced network functions aren't needed.
    private String subnet;

    private String deviceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private Session session;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Column(nullable = false)
    private Instant expiresAt;

    @CreationTimestamp
    private Instant createdAt;
}
