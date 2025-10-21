package com.example.demo.controller;

import com.example.demo.dto.ChatMessageDTO;
import com.example.demo.entity.ChatMessage;
import com.example.demo.service.ChatService;
import com.example.demo.service.ModerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;
    private final ModerationService moderationService;

    /**
     * Handles incoming chat messages from a user.
     * The @MessageMapping annotation ensures this method is called when a message is sent
     * to the destination "/app/chat/{roomId}/sendMessage".
     */
    @MessageMapping("/chat/{roomId}/sendMessage")
    public void sendMessage(@DestinationVariable UUID roomId, @Payload ChatMessageDTO chatMessageDTO) {
        // Check for inappropriate content before saving or broadcasting
        if (moderationService.containsBlockedContent(chatMessageDTO.getContent())) {
            // Optionally, send a private message back to the sender about the block
            // For now, we just won't broadcast it.
            System.out.println("Blocked message from " + chatMessageDTO.getSenderSessionId());
            return;
        }

        // Save the message to the database
        ChatMessage savedMessage = chatService.saveMessage(chatMessageDTO);

        // Broadcast the saved message to all clients subscribed to this room's topic.
        // The topic is "/topic/chat/{roomId}".
        messagingTemplate.convertAndSend("/topic/chat/" + roomId, savedMessage);
    }
}
