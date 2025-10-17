package donation.example.donation.system.controller;

import donation.example.donation.system.model.Role;
import donation.example.donation.system.model.User;
import donation.example.donation.system.repository.UserRepository;
import donation.example.donation.system.security.JWTUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JWTUtil jwtUtil,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Authenticates a user and returns a JWT token upon successful login.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            String token = jwtUtil.generateToken(username);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    /**
     * Registers a new user, saves them to the database, and returns a JWT token.
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> signUpRequest) {
        String username = signUpRequest.get("username");
        String email = signUpRequest.get("email");
        String password = signUpRequest.get("password");

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User(username, email, passwordEncoder.encode(password));

        // Assign roles based on the signup request
        String roleStr = signUpRequest.get("role");
        Set<Role> roles;
        if ("ADMIN".equalsIgnoreCase(roleStr)) {
            roles = Set.of(Role.ROLE_ADMIN);
        } else if ("STAFF".equalsIgnoreCase(roleStr)) {
            roles = Set.of(Role.ROLE_STAFF);
        } else {
            roles = Set.of(Role.ROLE_DONOR); // Default to DONOR
        }
        user.setRoles(roles);

        userRepository.save(user);

        // Generate and return the token immediately for a better UX
        String token = jwtUtil.generateToken(user.getUsername());

        return ResponseEntity.ok(Map.of(
                "message", "User registered successfully!",
                "token", token
        ));
    }
}