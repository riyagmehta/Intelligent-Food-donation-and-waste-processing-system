package donation.example.donation.system.controller;

import donation.example.donation.system.dto.CollectionCenterDTO;
import donation.example.donation.system.dto.DonationDTO;
import donation.example.donation.system.mapper.DonationMapper;
import donation.example.donation.system.model.entity.CollectionCenter;
import donation.example.donation.system.model.entity.Donation;
import donation.example.donation.system.type.DonationStatus;
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
    private final DonationMapper donationMapper;

    public DonationController(DonationRepository donationRepository, DonorRepository donorRepository, DonationMapper donationMapper) {
        this.donationRepository = donationRepository;
        this.donorRepository = donorRepository;
        this.donationMapper = donationMapper;
    }

    // Get all donations
    @GetMapping
    public List<DonationDTO> getAllDonations() {
        return donationRepository.findAll().stream()
                .map(donationMapper::donationToDonationDTO)
                .collect(Collectors.toList());
    }

    // Get donation by ID
    @GetMapping("/{id}")
    public ResponseEntity<DonationDTO> getDonationById(@PathVariable Long id) {
        return donationRepository.findById(id)
                .map(donation -> ResponseEntity.ok(donationMapper.donationToDonationDTO(donation)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Get donations by status
    @GetMapping("/status/{status}")
    public List<DonationDTO> getDonationsByStatus(@PathVariable DonationStatus status) {
        return donationRepository.findByStatus(status).stream()
                .map(donationMapper::donationToDonationDTO)
                .collect(Collectors.toList());
    }

    // Get donations by donor ID
    @GetMapping("/donor/{donorId}")
    public List<DonationDTO> getDonationsByDonor(@PathVariable Long donorId) {
        return donationRepository.findByDonorId(donorId).stream()
                .map(donationMapper::donationToDonationDTO)
                .collect(Collectors.toList());
    }

    // Create new donation
    @PostMapping("/donor/{donorId}")
    public ResponseEntity<DonationDTO> createDonation(@PathVariable Long donorId, @RequestBody Donation donation) {
        return donorRepository.findById(donorId).map(donor -> {
            donation.setDonor(donor);
            return ResponseEntity.ok(donationMapper.donationToDonationDTO(donationRepository.save(donation)));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Update donation status
    @PutMapping("/{id}/status")
    public ResponseEntity<DonationDTO> updateDonationStatus(@PathVariable Long id, @RequestBody DonationStatus status) {
        return donationRepository.findById(id).map(donation -> {
            donation.setStatus(status);
            return ResponseEntity.ok(donationMapper.donationToDonationDTO(donationRepository.save(donation)));
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
