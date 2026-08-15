package com.handmadecrafts.backend.service;

import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.Properties;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    private EmailService emailService;

    @BeforeEach
    void setUp() {
        emailService = new EmailService(mailSender, "noreply@craftnest.com");
    }

    @Test
    void shouldConstructAndSendMimeMessage() throws Exception {
        MimeMessage mimeMessage = new MimeMessage(Session.getDefaultInstance(new Properties()));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendOtpEmail("recipient@example.com", "123456", "Test Verification OTP");

        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, times(1)).send(captor.capture());

        MimeMessage sentMessage = captor.getValue();
        assertNotNull(sentMessage);
        assertEquals("Test Verification OTP", sentMessage.getSubject());
        assertEquals("recipient@example.com", sentMessage.getAllRecipients()[0].toString());
        assertEquals("noreply@craftnest.com", sentMessage.getFrom()[0].toString());
    }
}
