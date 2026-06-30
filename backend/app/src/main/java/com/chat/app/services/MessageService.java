package com.chat.app.services;

import com.chat.app.entities.Conversation;
import com.chat.app.entities.Message;
import com.chat.app.exceptions.BaseException;
import com.chat.app.repositories.MessageRepository;
import com.chat.app.repositories.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;

    public Message save(Long conversationId, Long senderId, String content) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow();

        Long user1Id = conversation.getUser1().getId();
        Long user2Id = conversation.getUser2().getId();

        boolean isMember = senderId.equals(user1Id) || senderId.equals(user2Id);

        if (!isMember)
            throw new BaseException(
                    "Sender is not a member of this conversation",
                    HttpStatus.UNAUTHORIZED
            );

        Message message = new Message();
        message.setConversation(conversation);
        message.setSenderId(senderId);
        message.setContent(content);

        return messageRepository.save(message);
    }
}