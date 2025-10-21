package com.example.demo.controller;

import com.example.demo.dto.QueueRequest;
import com.example.demo.dto.SessionRequest;
import com.example.demo.dto.SessionResponse;
import com.example.demo.entity.ChatRoom;
import com.example.demo.entity.Session;
import com.example.demo.service.MatchmakingService;
import com.example.demo.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MatchmakingController {

    private final VerificationService verificationService;
    private final MatchmakingService matchmakingService;

    @PostMapping("/sessions")
    public ResponseEntity<SessionResponse> createSession(@RequestBody SessionRequest sessionRequest) {
        Session newSession = verificationService.createSession(
                sessionRequest.getGender(),
                sessionRequest.getDeviceId()
        );
        SessionResponse response = SessionResponse.from(newSession);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/queue/join")
    public ResponseEntity<?> joinQueue(@RequestBody QueueRequest queueRequest) {
        Optional<ChatRoom> chatRoomOptional = matchmakingService.joinQueueAndFindMatch(
                queueRequest.getSessionId(),
                queueRequest.getChatMode()
        );

        if (chatRoomOptional.isPresent()) {
            // ✅ Match found — return chat room info
            return ResponseEntity.ok(chatRoomOptional.get());
        }

        // ✅ No match yet — user added to queue
        return ResponseEntity.ok("User has been added to the queue.");
    }

    @PostMapping("/queue/leave")
    public ResponseEntity<Void> leaveQueue(@RequestBody QueueRequest queueRequest) {
        matchmakingService.leaveQueue(queueRequest.getSessionId());
        return ResponseEntity.ok().build();
    }
}
