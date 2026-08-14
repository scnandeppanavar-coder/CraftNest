package com.handmadecrafts.backend.service;

import com.handmadecrafts.backend.dto.*;
import com.handmadecrafts.backend.entity.*;
import com.handmadecrafts.backend.exception.*;
import com.handmadecrafts.backend.repository.JwtTokenRepository;
import com.handmadecrafts.backend.repository.UserRepository;
import com.handmadecrafts.backend.security.JwtUtils;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenRepository jwtTokenRepository;
    private final OtpService otpService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository,
                       JwtTokenRepository jwtTokenRepository,
                       OtpService otpService,
                       EmailService emailService,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.jwtTokenRepository = jwtTokenRepository;
        this.otpService = otpService;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public void register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email is already registered");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyExistsException("Username is already taken");
        }

        String otp = otpService.generateOtp();
        otpService.storeRegistrationOtp(email, request, otp);
        System.out.println("Stored OTP for: " + request.getEmail() + " = " + otp);
        emailService.sendOtpEmail(email, otp, "Registration Verification OTP");
    }

    @Transactional
    public void verifyRegistrationOtp(String email, String otp) {

    email = email.trim().toLowerCase();
    otp = otp.trim();

    RegisterRequest registerRequest =
            otpService.getAndValidateRegistrationRequest(email, otp);

    if (registerRequest == null) {
        throw new InvalidOtpException("Invalid or expired OTP");
    }

    User user = User.builder()
            .username(registerRequest.getUsername())
            .email(registerRequest.getEmail())
            .password(passwordEncoder.encode(registerRequest.getPassword()))
            .role(Role.CUSTOMER)
            .createdAt(LocalDate.now())
            .build();

    userRepository.save(user);
}

    @Transactional
    public LoginResponse customerLogin(LoginRequest request) {

    String email = request.getEmail().trim().toLowerCase();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

    boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword())
            || request.getPassword().equals(user.getPassword());

    if (!matches) {
        throw new BadCredentialsException("Invalid email or password");
    }

    if (user.getRole() != Role.CUSTOMER) {
        throw new BadCredentialsException("Please use the Admin Login page.");
    }

    String token = jwtUtils.generateToken(user.getEmail());

    jwtTokenRepository.deleteByUserUserId(user.getUserId());

    JwtToken jwtToken = JwtToken.builder()
            .user(user)
            .token(token)
            .createdAt(LocalDate.now())
            .expiresAt(LocalDate.now().plusDays(1))
            .build();

    jwtTokenRepository.save(jwtToken);

    return LoginResponse.builder()
            .token(token)
            .email(user.getEmail())
            .username(user.getUsername())
            .role(user.getRole().name())
            .userId(user.getUserId())
            .build();
}

    @Transactional
public LoginResponse adminLogin(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

    boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword())
            || request.getPassword().equals(user.getPassword());

    if (!matches) {
        throw new BadCredentialsException("Invalid email or password");
    }

    if (user.getRole() != Role.ADMIN) {
        throw new BadCredentialsException("Access denied. Admin login only.");
    }

    String token = jwtUtils.generateToken(user.getEmail());

    jwtTokenRepository.deleteByUserUserId(user.getUserId());

    JwtToken jwtToken = JwtToken.builder()
            .user(user)
            .token(token)
            .createdAt(LocalDate.now())
            .expiresAt(LocalDate.now().plusDays(1))
            .build();

    jwtTokenRepository.save(jwtToken);

    return LoginResponse.builder()
            .token(token)
            .email(user.getEmail())
            .username(user.getUsername())
            .role(user.getRole().name())
            .userId(user.getUserId())
            .build();
}
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No user found with email: " + request.getEmail()));

        String otp = otpService.generateOtp();
        otpService.storeForgotPasswordOtp(user.getEmail(), otp);
        emailService.sendOtpEmail(user.getEmail(), otp, "Password Reset OTP");
    }

    @Transactional
    public void verifyForgotPasswordOtp(VerifyForgotPasswordOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        boolean isValid = otpService.validateForgotPasswordOtp(email, request.getOtp());
        if (!isValid) {
            throw new InvalidOtpException("Invalid or expired OTP");
        }
        otpService.markEmailAsVerifiedForReset(email);
        otpService.clearForgotPasswordOtp(email);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (!otpService.isEmailVerifiedForReset(email)) {
            throw new InvalidOtpException("Email verification is missing or expired. Please verify OTP first.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No user found with email: " + request.getEmail()));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDate.now().toString());
        userRepository.save(user);

        otpService.clearEmailVerifiedForReset(email);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No user found with email: " + request.getEmail()));

        boolean oldMatches = passwordEncoder.matches(request.getOldPassword(), user.getPassword())
                || request.getOldPassword().equals(user.getPassword());

        if (!oldMatches) {
            throw new IllegalArgumentException("Invalid current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDate.now().toString());
        userRepository.save(user);
    }
}
