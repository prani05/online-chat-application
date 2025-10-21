package com.example.demo.dto;

import com.example.demo.domain.UserGender;
import com.example.demo.entity.Session;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionResponse {
    private java.util.UUID id;
    private UserGender userGender;
    private UserGender verifiedGender;
    private String deviceId;
    private String ipAddress;

    public static SessionResponse from(Session s) {
        return new SessionResponse(
                s.getSessionId(), s.getUserGender(), s.getVerifiedGender(), s.getDeviceId(), s.getIpAddress()
        );
    }
}
