package com.example.demo.controller;

import com.example.demo.dto.VerificationRequest;
import com.example.demo.dto.SessionResponse;
import com.example.demo.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @PostMapping("/sessions")
    public ResponseEntity<SessionResponse> create(@RequestBody VerificationRequest request) {
        var session = verificationService.createSession(request.getGender(), request.getDeviceId());
        return ResponseEntity.ok(SessionResponse.from(session));
    }
}
