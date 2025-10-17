package donation.example.donation.system.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RoleTestController {

    @GetMapping("/admin/test")
    public String adminAccess() {
        return "Welcome, Admin!";
    }

    @GetMapping("/staff/test")
    public String staffAccess() {
        return "Welcome, Staff!";
    }

    @GetMapping("/donor/test")
    public String donorAccess() {
        return "Welcome, Donor!";
    }

    @GetMapping("/public/test")
    public String publicAccess() {
        return "This endpoint is public and does not require authentication.";
    }
}
