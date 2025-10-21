package com.example.demo.dto;

import com.example.demo.domain.ChatMode;
import lombok.Data;
import java.util.UUID;

/**
 * Data Transfer Object for a user entering the matchmaking queue.
 */
@Data
public class QueueRequest {
    private UUID sessionId;
    private ChatMode chatMode;
}
