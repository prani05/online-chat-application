package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // The broker is responsible for routing messages from the server to clients.
        // "/topic" is a prefix for topics that clients can subscribe to.
        config.enableSimpleBroker("/topic");

        // This prefix is for messages bound for @MessageMapping-annotated methods in controllers.
        // When a client sends a message to "/app/chat/...", it will be routed to a controller method.
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // This is the HTTP endpoint that clients will connect  to upgrade to WebSocket.
        // We allow all origins for development and use SockJS as a fallback.
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }
}
