package com.handmadecrafts.backend.service;

import com.handmadecrafts.backend.dto.ChatRequest;
import com.handmadecrafts.backend.entity.Product;
import com.handmadecrafts.backend.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HuggingFaceService {

    private static final Logger logger = LoggerFactory.getLogger(HuggingFaceService.class);

    @Value("${huggingface.api.url}")
    private String apiUrl;

    @Value("${huggingface.api.token}")
    private String apiToken;

    @Value("${huggingface.model}")
    private String modelName;

    private final RestTemplate restTemplate;
    private final ProductRepository productRepository;

    public HuggingFaceService(ProductRepository productRepository) {
        this.restTemplate = new RestTemplate();
        this.productRepository = productRepository;
    }

    public String getChatReply(String message, List<ChatRequest.ChatMessage> history) {
        if (apiToken == null || apiToken.trim().isEmpty() || "${HF_TOKEN}".equals(apiToken)) {
            logger.error("Hugging Face API token is not configured!");
            throw new IllegalStateException("Hugging Face API token is not configured!");
        }

        // Retrieve live products from database
        List<Product> products = productRepository.findAll();
        StringBuilder catalogBuilder = new StringBuilder();
        catalogBuilder.append("Here is the exact real-time catalog of products in our database. Do not mention or recommend any products not listed here:\n");
        for (Product p : products) {
            if (p.getActive() == null || !p.getActive()) {
                continue;
            }
            catalogBuilder.append("- Name: \"").append(p.getName()).append("\"")
                .append(", Category: \"").append(p.getCategory() != null ? p.getCategory().getCategoryName() : "None").append("\"")
                .append(", Price: ").append(p.getPrice())
                .append(", Description: \"").append(p.getDescription()).append("\"")
                .append(", Stock: ").append(p.getStock())
                .append(", Status: ").append(p.getStock() > 0 ? "In Stock" : "Out of Stock")
                .append("\n");
        }
        String catalog = catalogBuilder.toString();

        String url = apiUrl.endsWith("/") ? apiUrl + "chat/completions" : apiUrl + "/chat/completions";
        logger.info("Sending chat request to Hugging Face URL: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiToken);

        List<Map<String, String>> messages = new ArrayList<>();

        // System prompt to set context and strictly enforce real products
        String systemPrompt = "You are the friendly customer support assistant for CraftNest (ArtisanCrafts), an e-commerce platform specializing in premium handcrafted goods.\n\n"
            + catalog + "\n"
            + "Strict Guidelines:\n"
            + "1. Rely ONLY on the product details (name, category, price, description, stock, status) provided in the catalog above. Never invent, extrapolate, or hallucinate products or product details.\n"
            + "2. If a user asks about a product that does not exist in the catalog (e.g., if they ask for a brand or type of product not listed, or a watch if there is no watch in our catalog), clearly state that it is not currently available.\n"
            + "3. If a product exists but has Stock = 0, explicitly say it is currently out of stock.\n"
            + "4. Keep your responses short, friendly, and accurate.";

        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemPrompt);
        messages.add(systemMessage);

        // Add history
        if (history != null) {
            for (ChatRequest.ChatMessage msg : history) {
                Map<String, String> m = new HashMap<>();
                m.put("role", msg.getRole());
                m.put("content", msg.getContent());
                messages.add(m);
            }
        }

        // Add the current message
        Map<String, String> currentMsg = new HashMap<>();
        currentMsg.put("role", "user");
        currentMsg.put("content", message);
        messages.add(currentMsg);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", modelName);
        requestBody.put("messages", messages);
        requestBody.put("max_tokens", 500);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Map<String, Object> body = response.getBody();
            List<Map<String, Object>> choices = (List<Map<String, Object>>) body.get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> choice = choices.get(0);
                Map<String, Object> replyMsg = (Map<String, Object>) choice.get("message");
                if (replyMsg != null) {
                    return (String) replyMsg.get("content");
                }
            }
        }
        logger.warn("Unsuccessful or empty response from Hugging Face: {}", response);
        throw new RuntimeException("Unsuccessful or empty response from Hugging Face API");
    }
}
