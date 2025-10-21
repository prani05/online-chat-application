package com.example.demo.service;

import com.example.demo.domain.UserGender;
import com.example.demo.entity.Session;
import com.example.demo.repository.SessionRepository;
import com.example.demo.util.ClientIpUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final SessionRepository sessionRepository;
    private final HttpServletRequest request;

    public Session createSession(UserGender gender, String deviceId) {
        Session newSession = new Session();
        newSession.setUserGender(gender);
        newSession.setVerifiedGender(gender);
        newSession.setDeviceId(deviceId);
        String ip = ClientIpUtils.getClientIp(request, 1); // set hops for your proxy
        newSession.setIpAddress(ip);

        return sessionRepository.save(newSession);
    }
}
