package com.handmadecrafts.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private RestTemplate restTemplate;

    private EmailService emailService;

    @BeforeEach
    void setUp() {
        emailService = new EmailService("brevo-test-key", "noreply@craftnest.com", restTemplate);
    }

    @Test
    void shouldConstructAndSendBrevoPostRequest() {
        // Arrange
        ResponseEntity<Map> mockResponse = new ResponseEntity<>(HttpStatus.OK);
        when(restTemplate.postForEntity(
                eq("https://api.brevo.com/v3/smtp/email"),
                any(HttpEntity.class),
                eq(Map.class)
        )).thenReturn(mockResponse);

        // Act
        emailService.sendOtpEmail("recipient@example.com", "123456", "Test Verification OTP");

        // Assert
        ArgumentCaptor<HttpEntity<Map<String, Object>>> captor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate, times(1)).postForEntity(
                eq("https://api.brevo.com/v3/smtp/email"),
                captor.capture(),
                eq(Map.class)
        );

        HttpEntity<Map<String, Object>> entity = captor.getValue();
        assertNotNull(entity);

        // Verify headers
        assertEquals("brevo-test-key", entity.getHeaders().getFirst("api-key"));
        assertEquals("application/json", entity.getHeaders().getContentType().toString());

        // Verify body
        Map<String, Object> body = entity.getBody();
        assertNotNull(body);
        assertEquals("Test Verification OTP", body.get("subject"));
        assertTrue(body.get("htmlContent").toString().contains("123456"));

        Map<String, String> sender = (Map<String, String>) body.get("sender");
        assertEquals("noreply@craftnest.com", sender.get("email"));
        assertEquals("ArtisanCrafts", sender.get("name"));

        List<Map<String, String>> to = (List<Map<String, String>>) body.get("to");
        assertEquals(1, to.size());
        assertEquals("recipient@example.com", to.get(0).get("email"));
    }
}
