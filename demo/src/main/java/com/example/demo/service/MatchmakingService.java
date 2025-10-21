package com.example.demo.service;

import com.example.demo.domain.ChatMode;
import com.example.demo.domain.SessionStatus;
import com.example.demo.domain.UserGender;
import com.example.demo.entity.ChatRoom;
import com.example.demo.entity.Queue;
import com.example.demo.entity.Session;
import com.example.demo.repository.ChatRoomRepository;
import com.example.demo.repository.QueueRepository;
import com.example.demo.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MatchmakingService {

    private final QueueRepository queueRepository;
    private final SessionRepository sessionRepository;
    private final ChatRoomRepository chatRoomRepository;

    /**
     * Adds a user to the matchmaking queue and immediately attempts to find a match.
     * @param sessionId The ID of the user's session.
     * @param chatMode The desired chat mode (text/video).
     * @return An Optional containing the ChatRoom if a match was made, otherwise empty.
     */
    @Transactional
    public Optional<ChatRoom> joinQueueAndFindMatch(UUID sessionId, ChatMode chatMode) {
        Session currentUserSession = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));

        UserGender currentUserGender = currentUserSession.getUserGender();
        UserGender oppositeGender = (currentUserGender == UserGender.male) ? UserGender.female : UserGender.male;

        // 1. Look for a match
        Optional<Queue> matchOptional = queueRepository
                .findFirstByGenderAndChatModeAndSession_SessionIdNotOrderByEnteredAtAsc(oppositeGender, chatMode, sessionId);

        if (matchOptional.isPresent()) {
            // MATCH FOUND
            Queue matchedQueueEntry = matchOptional.get();
            Session matchedSession = matchedQueueEntry.getSession();

            // Create a new chat room
            ChatRoom newRoom = new ChatRoom();
            newRoom.setUser1Session(currentUserSession);
            newRoom.setUser2Session(matchedSession);
            newRoom.setChatType(chatMode.toString());
            chatRoomRepository.save(newRoom);

            // Update both users' status to 'active'
            currentUserSession.setStatus(SessionStatus.active);
            matchedSession.setStatus(SessionStatus.active);
            sessionRepository.save(currentUserSession);
            sessionRepository.save(matchedSession);

            // Remove the matched user from the queue
            queueRepository.delete(matchedQueueEntry);

            return Optional.of(newRoom);
        } else {
            // NO MATCH FOUND - Add current user to the queue
            // Check if user is already in queue to prevent duplicates
            if (queueRepository.findBySession(currentUserSession).isEmpty()) {
                Queue newQueueEntry = new Queue();
                newQueueEntry.setSession(currentUserSession);
                newQueueEntry.setGender(currentUserGender);
                newQueueEntry.setChatMode(chatMode);
                queueRepository.save(newQueueEntry);
            }
            return Optional.empty();
        }
    }

    /**
     * Removes a user from the queue.
     * @param sessionId The ID of the session to remove.
     */
    @Transactional
    public void leaveQueue(UUID sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        queueRepository.findBySession(session).ifPresent(queueRepository::delete);
    }
}
