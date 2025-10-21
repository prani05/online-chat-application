package com.example.demo.util;

import jakarta.servlet.http.HttpServletRequest;

public final class ClientIpUtils {
    private ClientIpUtils() {}

    // Adjust trustedProxyHops to your infra: e.g., 1 = one Nginx/Ingress in front
    public static String getClientIp(HttpServletRequest request, int trustedProxyHops) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            String[] parts = xff.split(",");
            for (int i = 0; i < parts.length; i++) parts[i] = parts[i].trim();
            int idx = parts.length - 1 - trustedProxyHops;
            if (idx >= 0) return parts[idx];
        }
        return request.getRemoteAddr();
    }
}
