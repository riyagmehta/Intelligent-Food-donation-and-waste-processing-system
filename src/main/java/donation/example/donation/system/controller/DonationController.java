package donation.example.donation.system.controller;

import donation.example.donation.system.model.Donation;
import donation.example.donation.system.model.DonationStatus;
import donation.example.donation.system.repository.DonationRepository;
import donation.example.donation.system.repository.DonorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationRepository donationRepository;
    private final DonorRepository donorRepository;

    public DonationController(DonationRepository donationRepository, DonorRepository donorRepository) {
        this.donationRepository = donationRepository;
        this.donorRepository = donorRepository;
    }

    // Get all donations
    @GetMapping
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    // Get donation by ID
    @GetMapping("/{id}")
    public ResponseEntity<Donation> getDonationById(@PathVariable Long id) {
        return donationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get donations by status
    @GetMapping("/status/{status}")
    public List<Donation> getDonationsByStatus(@PathVariable DonationStatus status) {
        return donationRepository.findByStatus(status);
    }

    // Get donations by donor ID
    @GetMapping("/donor/{donorId}")
    public List<Donation> getDonationsByDonor(@PathVariable Long donorId) {
        return donationRepository.findByDonorId(donorId);
    }

    // Create new donation
    @PostMapping("/donor/{donorId}")
    public ResponseEntity<Donation> createDonation(@PathVariable Long donorId, @RequestBody Donation donation) {
        return donorRepository.findById(donorId).map(donor -> {
            donation.setDonor(donor);
            return ResponseEntity.ok(donationRepository.save(donation));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Update donation status
    @PutMapping("/{id}/status")
    public ResponseEntity<Donation> updateDonationStatus(@PathVariable Long id, @RequestBody DonationStatus status) {
        return donationRepository.findById(id).map(donation -> {
            donation.setStatus(status);
            return ResponseEntity.ok(donationRepository.save(donation));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete donation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonation(@PathVariable Long id) {
        return donationRepository.findById(id).map(donation -> {
            donationRepository.delete(donation);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
