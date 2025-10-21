package com.example.demo.dto;

import com.example.demo.domain.UserGender;
import lombok.Data;

/**
 * Data Transfer Object for creating a new session.
 * This is the information we expect from the frontend.
 */
@Data
public class SessionRequest {
    private UserGender gender;
    private String deviceId;
}
