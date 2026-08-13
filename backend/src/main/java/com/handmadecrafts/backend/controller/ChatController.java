package com.handmadecrafts.backend.controller;

import com.handmadecrafts.backend.dto.ChatRequest;
import com.handmadecrafts.backend.dto.ChatResponse;
import com.handmadecrafts.backend.service.HuggingFaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final HuggingFaceService huggingFaceService;

    public ChatController(HuggingFaceService huggingFaceService) {
        this.huggingFaceService = huggingFaceService;
    }

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody ChatRequest request) {
        try {
            String reply = huggingFaceService.getChatReply(request.getMessage(), request.getHistory());
            return ResponseEntity.ok(ChatResponse.builder().reply(reply).build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Map.of("error", e.getMessage()));
        }
    }
}
