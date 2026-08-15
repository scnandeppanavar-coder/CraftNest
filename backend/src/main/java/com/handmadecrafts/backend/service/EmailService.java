package com.handmadecrafts.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class EmailService {

    private final String apiKey;
    private final String fromAddress;
    private final RestTemplate restTemplate;

    @Autowired
    public EmailService(
            @Value("${BREVO_API_KEY}") String apiKey,
            @Value("${app.mail.from:}") String fromAddress) {
        this.apiKey = apiKey;
        this.restTemplate = new RestTemplate();
        if (fromAddress == null || fromAddress.isBlank()) {
            this.fromAddress = "noreply@craftnest.com";
        } else {
            this.fromAddress = fromAddress;
        }
    }

    // Package-private constructor for testing
    EmailService(String apiKey, String fromAddress, RestTemplate restTemplate) {
        this.apiKey = apiKey;
        this.fromAddress = fromAddress;
        this.restTemplate = restTemplate;
    }

    public void sendOtpEmail(String toEmail, String otp, String subject) {

        log.info("Preparing OTP email via Brevo API: to={}, from={}",
                maskEmail(toEmail),
                maskEmail(fromAddress));

        if (apiKey == null || apiKey.isBlank() || apiKey.equals("dummy")) {
            String msg = "Brevo API key is missing or not configured.";
            log.error("Brevo OTP send failed. Diagnostic: {}", msg);
            throw new IllegalStateException("Failed to send OTP email: " + msg);
        }

        try {

            String htmlBody = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport"
                              content="width=device-width, initial-scale=1.0">
                    </head>

                    <body style="
                        margin:0;
                        padding:0;
                        background-color:#FAF7F2;
                        font-family:Arial, Helvetica, sans-serif;
                    ">

                        <div style="
                            max-width:600px;
                            margin:40px auto;
                            background:#ffffff;
                            border-radius:20px;
                            overflow:hidden;
                            box-shadow:0 8px 30px rgba(0,0,0,0.08);
                        ">

                            <!-- Header -->
                            <div style="
                                background:#D67A57;
                                padding:28px;
                                text-align:center;
                            ">
                                <h1 style="
                                    margin:0;
                                    color:#ffffff;
                                    font-size:28px;
                                ">
                                    Artisan<span style="color:#FFF3EE;">Crafts</span>
                                </h1>

                                <p style="
                                    margin:8px 0 0;
                                    color:#FFF3EE;
                                    font-size:14px;
                                ">
                                    Handmade with love
                                </p>
                            </div>

                            <!-- Content -->
                            <div style="
                                padding:40px 30px;
                                text-align:center;
                            ">

                                <h2 style="
                                    margin:0 0 12px;
                                    color:#2F2F2F;
                                    font-size:25px;
                                ">
                                    Verify Your Email
                                </h2>

                                <p style="
                                    color:#6B6B6B;
                                    font-size:15px;
                                    line-height:1.6;
                                    margin-bottom:25px;
                                ">
                                    Use the verification code below to continue
                                    with your ArtisanCrafts account.
                                </p>

                                <!-- OTP Box -->
                                <div style="
                                    display:inline-block;
                                    background:#FAF7F2;
                                    border:2px solid #D67A57;
                                    border-radius:14px;
                                    padding:18px 35px;
                                    margin:10px 0 25px;
                                ">
                                    <span style="
                                        color:#D67A57;
                                        font-size:32px;
                                        font-weight:bold;
                                        letter-spacing:8px;
                                    ">
                                        %s
                                    </span>
                                </div>

                                <p style="
                                    color:#6B6B6B;
                                    font-size:14px;
                                    line-height:1.6;
                                 ">
                                    This OTP will expire in
                                    <strong>5 minutes</strong>.
                                </p>

                                <p style="
                                    color:#999999;
                                    font-size:13px;
                                    margin-top:25px;
                                ">
                                    If you did not request this verification code,
                                    you can safely ignore this email.
                                </p>

                            </div>

                            <!-- Footer -->
                            <div style="
                                background:#2F2F2F;
                                padding:20px;
                                text-align:center;
                            ">
                                <p style="
                                    margin:0;
                                    color:#dddddd;
                                    font-size:12px;
                                ">
                                    © 2026 ArtisanCrafts. All rights reserved.
                                </p>
                            </div>

                        </div>

                    </body>
                    </html>
                    """.formatted(otp);

            // Construct payload according to Brevo API specification
            Map<String, Object> requestBody = new HashMap<>();

            Map<String, String> senderMap = new HashMap<>();
            senderMap.put("name", "ArtisanCrafts");
            senderMap.put("email", fromAddress);
            requestBody.put("sender", senderMap);

            Map<String, String> recipientMap = new HashMap<>();
            recipientMap.put("email", toEmail);
            requestBody.put("to", Collections.singletonList(recipientMap));

            requestBody.put("subject", subject);
            requestBody.put("htmlContent", htmlBody);

            // Set HTTPS headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.brevo.com/v3/smtp/email",
                    entity,
                    Map.class
                );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("OTP email successfully sent to Brevo API for {}", maskEmail(toEmail));
            } else {
                log.error("Brevo API returned unexpected status code: {}", response.getStatusCode());
                throw new IllegalStateException("Failed to send OTP email via Brevo API: Unexpected status");
            }

        } catch (HttpStatusCodeException e) {
            log.error("Brevo API error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new IllegalStateException("Failed to send OTP email via Brevo API", e);
        } catch (Exception e) {
            log.error("Unexpected error while sending OTP email via Brevo: {}", e.getMessage(), e);
            throw new IllegalStateException("Failed to send OTP email via Brevo API: Unexpected server error", e);
        }
    }

    private String maskEmail(String value) {

        if (value == null || value.isBlank()) {
            return "<not-set>";
        }

        int at = value.indexOf('@');

        if (at <= 1) {
            return "***";
        }

        return value.substring(0, 2)
                + "***"
                + value.substring(at);
    }
}