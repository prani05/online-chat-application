package com.example.demo.service;

import com.example.demo.dto.ChatMessageDTO;
import com.example.demo.entity.ChatMessage;
import com.example.demo.entity.ChatRoom;
import com.example.demo.entity.Session;
import com.example.demo.repository.ChatMessageRepository;
import com.example.demo.repository.ChatRoomRepository;
import com.example.demo.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final SessionRepository sessionRepository;
    private final ChatRoomRepository chatRoomRepository;

    /**
     * Saves a new chat message to the database.
     * @param messageDTO The message data from the client.
     * @return The saved ChatMessage entity.
     */
    public ChatMessage saveMessage(ChatMessageDTO messageDTO) {
        Session sender = sessionRepository.findById(messageDTO.getSenderSessionId())
                .orElseThrow(() -> new IllegalArgumentException("Sender session not found"));
        ChatRoom room = chatRoomRepository.findById(messageDTO.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found"));

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setRoom(room);
        chatMessage.setSenderSession(sender);
        chatMessage.setContent(messageDTO.getContent());
        chatMessage.setMessageType(messageDTO.getMessageType());

        return chatMessageRepository.save(chatMessage);
    }
}
