package com.example.demo.service;

import com.example.demo.entity.Ban;
import com.example.demo.repository.BanRepository;
import com.example.demo.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ModerationService {

    private final ReportRepository reportRepository;
    private final BanRepository banRepository;

    private static final List<String> BANNED_WORDS = List.of("badword1", "badword2", "inappropriate");

    /**
     * Checks if a user is currently banned based on their IP or device ID.
     * @param ipAddress The user's IP address.
     * @param deviceId The user's device ID.
     * @return true if an active ban is found, false otherwise.
     */
    public boolean isBanned(String ipAddress, String deviceId) {
        // In a real app, you would add more sophisticated checks here.
        // For example, checking the ban repository.
        return false;
    }

    /**
     * Filters a message for banned words.
     * @param content The message content.
     * @return true if the content contains banned words, false otherwise.
     */
    public boolean containsBlockedContent(String content) {
        String lowerCaseContent = content.toLowerCase();
        for (String word : BANNED_WORDS) {
            if (lowerCaseContent.contains(word)) {
                return true;
            }
        }
        return false;
    }
}
