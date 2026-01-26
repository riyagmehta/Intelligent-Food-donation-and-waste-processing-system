package donation.example.donation.system.controller;

import donation.example.donation.system.type.Role;
import donation.example.donation.system.model.entity.User;
import donation.example.donation.system.model.entity.CollectionCenter;
import donation.example.donation.system.model.entity.Donor;
import donation.example.donation.system.model.entity.DeliveryPartner;
import donation.example.donation.system.repository.UserRepository;
import donation.example.donation.system.repository.CollectionCenterRepository;
import donation.example.donation.system.repository.DonorRepository;
import donation.example.donation.system.repository.DeliveryPartnerRepository;
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
    private final CollectionCenterRepository collectionCenterRepository;
    private final DonorRepository donorRepository;
    private final DeliveryPartnerRepository deliveryPartnerRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JWTUtil jwtUtil,
                          UserRepository userRepository,
                          CollectionCenterRepository collectionCenterRepository,
                          DonorRepository donorRepository,
                          DeliveryPartnerRepository deliveryPartnerRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.collectionCenterRepository = collectionCenterRepository;
        this.donorRepository = donorRepository;
        this.deliveryPartnerRepository = deliveryPartnerRepository;
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

            // Get user with roles
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtUtil.generateToken(username, user.getRoles());
            return ResponseEntity.ok(Map.of("token", token));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    /**
     * Registers a new user, saves them to the database, and returns a JWT token.
     * For STAFF role, also creates a CollectionCenter linked to the user.
     * For DONOR role, also creates a Donor record linked to the user.
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, Object> signUpRequest) {
        String username = (String) signUpRequest.get("username");
        String email = (String) signUpRequest.get("email");
        String password = (String) signUpRequest.get("password");

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is already taken!"));
        }
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is already in use!"));
        }

        // Create new user's account
        User user = new User(username, email, passwordEncoder.encode(password));

        // Assign roles based on the signup request
        String roleStr = (String) signUpRequest.get("role");
        Set<Role> roles;
        if ("ADMIN".equalsIgnoreCase(roleStr)) {
            roles = Set.of(Role.ROLE_ADMIN);
        } else if ("STAFF".equalsIgnoreCase(roleStr)) {
            roles = Set.of(Role.ROLE_STAFF);
        } else if ("DRIVER".equalsIgnoreCase(roleStr)) {
            roles = Set.of(Role.ROLE_DRIVER);
        } else {
            roles = Set.of(Role.ROLE_DONOR); // Default to DONOR
        }
        user.setRoles(roles);

        userRepository.save(user);

        // If STAFF role, create CollectionCenter linked to the user
        if ("STAFF".equalsIgnoreCase(roleStr)) {
            @SuppressWarnings("unchecked")
            Map<String, Object> centerData = (Map<String, Object>) signUpRequest.get("collectionCenter");
            if (centerData != null) {
                CollectionCenter center = new CollectionCenter();
                center.setName((String) centerData.get("name"));
                center.setLocation((String) centerData.get("location"));

                Object maxCapacityObj = centerData.get("maxCapacity");
                if (maxCapacityObj != null) {
                    if (maxCapacityObj instanceof Integer) {
                        center.setMaxCapacity((Integer) maxCapacityObj);
                    } else if (maxCapacityObj instanceof Number) {
                        center.setMaxCapacity(((Number) maxCapacityObj).intValue());
                    } else if (maxCapacityObj instanceof String) {
                        center.setMaxCapacity(Integer.parseInt((String) maxCapacityObj));
                    }
                }

                center.setCurrentLoad(0);
                center.setUser(user);
                collectionCenterRepository.save(center);
            }
        }

        // If DRIVER role, create DeliveryPartner linked to the user
        if ("DRIVER".equalsIgnoreCase(roleStr)) {
            @SuppressWarnings("unchecked")
            Map<String, Object> driverData = (Map<String, Object>) signUpRequest.get("driverInfo");
            DeliveryPartner driver = new DeliveryPartner();
            driver.setName(driverData != null ? (String) driverData.get("name") : username);
            driver.setPhone(driverData != null ? (String) driverData.get("phone") : null);
            driver.setVehicleNumber(driverData != null ? (String) driverData.get("vehicleNumber") : null);
            driver.setVehicleType(driverData != null ? (String) driverData.get("vehicleType") : null);
            driver.setIsAvailable(true);
            driver.setUser(user);

            // Optionally assign to a center
            if (driverData != null && driverData.get("collectionCenterId") != null) {
                Long centerId = ((Number) driverData.get("collectionCenterId")).longValue();
                collectionCenterRepository.findById(centerId).ifPresent(driver::setCollectionCenter);
            }

            deliveryPartnerRepository.save(driver);
        }

        // If DONOR role, create Donor record linked to the user
        if ("DONOR".equalsIgnoreCase(roleStr) || roleStr == null) {
            Donor donor = new Donor();
            donor.setName(username); // Use username as default name
            donor.setUser(user);
            donorRepository.save(donor);
        }

        // Generate and return the token with roles
        String token = jwtUtil.generateToken(user.getUsername(), user.getRoles());

        return ResponseEntity.ok(Map.of(
                "message", "User registered successfully!",
                "token", token
        ));
    }
}