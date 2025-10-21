package com.example.demo.entity;

import com.example.demo.domain.ChatRoomStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "chat_rooms")
@Data
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID roomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_session", nullable = false)
    private Session user1Session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_session", nullable = false)
    private Session user2Session;

    @Column(nullable = false)
    private String chatType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChatRoomStatus status = ChatRoomStatus.active;

    @CreationTimestamp
    private Instant createdAt;

    private Instant endedAt;
}
