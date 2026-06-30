package com.chat.app.controllers;

import com.chat.app.dtos.MessageRequest;
import com.chat.app.entities.Message;
import com.chat.app.exceptions.BaseException;
import com.chat.app.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class MessageSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/conversations/{conversationId}/messages")
    public void sendMessage(@DestinationVariable Long conversationId, Authentication authentication, MessageRequest request) {
        if (authentication == null)
            throw new BaseException("Unauthenticated user", HttpStatus.UNAUTHORIZED);

        Long senderId = (Long) authentication.getPrincipal();

        Message saved = messageService.save(
                conversationId,
                senderId,
                request.getContent()
        );

        String destination = "/broadcast/conversations/" + conversationId + "/messages";

        System.out.println("Broadcasting to: " + destination);

        messagingTemplate.convertAndSend(destination, saved);
    }
}