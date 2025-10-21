package com.example.demo.dto;

import com.example.demo.domain.UserGender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VerificationRequest {
    @NotNull
    private UserGender gender;

    @NotBlank
    private String deviceId;

    private Result face;
    private Result voice;

    @Data
    public static class Result {
        private String detectedGender;   // "male" | "female"
        private double confidence;       // 0..100
    }
}
