package com.vtcorp.store.controllers;

import com.vtcorp.store.dtos.PasswordDTO;
import com.vtcorp.store.dtos.MailDTO;
import com.vtcorp.store.dtos.LoginDTO;
import com.vtcorp.store.dtos.UserRequestDTO;
import com.vtcorp.store.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Login")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            return ResponseEntity.ok(userService.login(loginDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Register", description = "Required fields are mail, phone, name and password.")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRequestDTO userRequestDTO) {
        try {
            return ResponseEntity.ok(userService.register(userRequestDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Forgot password", description = "Validates the email and sends a link with token to change the password")
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody MailDTO mailDTO) {
        try {
            return ResponseEntity.ok(userService.forgotPassword(mailDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Reset password", description = "Validates the token from forgot-password and save the new password")
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordDTO passwordDTO) {
        try {
            return ResponseEntity.ok(userService.resetPassword(passwordDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Change password")
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordDTO passwordDTO, Authentication authentication) {
        try {
            String username = authentication.getName();
            return ResponseEntity.ok(userService.changePassword(username, passwordDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Change user's email", description = "Send a link with token to the new email to confirm")
    @PutMapping("/change-mail")
    public ResponseEntity<?> updateMail(@RequestBody MailDTO mailDTO, Authentication authentication) {
        try {
            String username = authentication.getName();
            return ResponseEntity.ok(userService.updateMail(username, mailDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Confirm change mail", description = "Validates the token and update the email")
    @GetMapping("/confirm-change-mail")
    public ResponseEntity<?> confirmChangeMail(@RequestParam String token, HttpServletResponse response) {
        try {
            response.sendRedirect(userService.confirmChangeMail(token));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}