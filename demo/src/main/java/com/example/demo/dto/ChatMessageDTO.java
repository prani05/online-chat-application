package com.example.demo.dto;

import com.example.demo.domain.MessageType;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

/**
 * Data Transfer Object for handling chat messages over WebSocket.
 */
@Data
public class ChatMessageDTO {
    private UUID roomId;
    private UUID senderSessionId;
    private String content;
    private MessageType messageType = MessageType.text;
    private Instant timestamp;
}
