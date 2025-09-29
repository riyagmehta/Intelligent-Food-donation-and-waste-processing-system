package donation.example.donation.system.controller;

import donation.example.donation.system.dto.CollectionCenterDTO;
import donation.example.donation.system.dto.DonationDTO;
import donation.example.donation.system.model.CollectionCenter;
import donation.example.donation.system.model.Donation;
import donation.example.donation.system.model.DonationStatus;
import donation.example.donation.system.repository.DonationRepository;
import donation.example.donation.system.repository.DonorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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
    public List<DonationDTO> getAllDonations() {
        return donationRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Get donation by ID
    @GetMapping("/{id}")
    public ResponseEntity<DonationDTO> getDonationById(@PathVariable Long id) {
        return donationRepository.findById(id)
                .map(donation -> ResponseEntity.ok(mapToDTO(donation)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Get donations by status
    @GetMapping("/status/{status}")
    public List<DonationDTO> getDonationsByStatus(@PathVariable DonationStatus status) {
        return donationRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Get donations by donor ID
    @GetMapping("/donor/{donorId}")
    public List<DonationDTO> getDonationsByDonor(@PathVariable Long donorId) {
        return donationRepository.findByDonorId(donorId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Create new donation
    @PostMapping("/donor/{donorId}")
    public ResponseEntity<DonationDTO> createDonation(@PathVariable Long donorId, @RequestBody Donation donation) {
        return donorRepository.findById(donorId).map(donor -> {
            donation.setDonor(donor);
            return ResponseEntity.ok(mapToDTO(donationRepository.save(donation)));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Update donation status
    @PutMapping("/{id}/status")
    public ResponseEntity<DonationDTO> updateDonationStatus(@PathVariable Long id, @RequestBody DonationStatus status) {
        return donationRepository.findById(id).map(donation -> {
            donation.setStatus(status);
            return ResponseEntity.ok(mapToDTO(donationRepository.save(donation)));
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

    // Helper: convert Donation -> DonationDTO
    private DonationDTO mapToDTO(Donation donation) {
        CollectionCenterDTO centerDTO = null;
        CollectionCenter center = donation.getCollectionCenter();
        if (center != null) {
            centerDTO = new CollectionCenterDTO(
                    center.getId(),
                    center.getName(),
                    center.getLocation(),
                    center.getMaxCapacity(),
                    center.getCurrentLoad()
            );
        }

        return new DonationDTO(
                donation.getId(),
                donation.getItemName(),
                donation.getQuantity(),
                donation.getUnit(),
                donation.getDonationDate(),
                donation.getStatus().name(),
                donation.getDonor() != null ? donation.getDonor().getId() : null,
                donation.getDonationType(),
                centerDTO
        );
    }
}
