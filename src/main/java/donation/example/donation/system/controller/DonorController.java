package donation.example.donation.system.controller;

import donation.example.donation.system.dto.DonorDTO;
import donation.example.donation.system.model.DonationType;
import donation.example.donation.system.model.Donor;
import donation.example.donation.system.repository.DonorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorRepository donorRepository;

    public DonorController(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    // Get all donors
    @GetMapping
    public List<DonorDTO> getAllDonors() {
        return donorRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get donor by ID
    @GetMapping("/{id}")
    public ResponseEntity<DonorDTO> getDonorById(@PathVariable Long id) {
        return donorRepository.findById(id)
                .map(donor -> ResponseEntity.ok(convertToDTO(donor)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-type/{type}")
    public List<DonorDTO> getDonorsByDonationType(@PathVariable DonationType type) {
        return donorRepository.findByDonationType(type).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Create new donor
    @PostMapping
    public DonorDTO createDonor(@RequestBody Donor donor) {
        Donor saved = donorRepository.save(donor);
        return convertToDTO(saved);
    }

    // Update donor
    @PutMapping("/{id}")
    public ResponseEntity<DonorDTO> updateDonor(@PathVariable Long id, @RequestBody Donor donorDetails) {
        return donorRepository.findById(id).map(donor -> {
            donor.setName(donorDetails.getName());
            donor.setContact(donorDetails.getContact());
            donor.setLocation(donorDetails.getLocation());
            Donor updated = donorRepository.save(donor);
            return ResponseEntity.ok(convertToDTO(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete donor
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonor(@PathVariable Long id) {
        return donorRepository.findById(id).map(donor -> {
            donorRepository.delete(donor);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Helper method to convert Donor to DonorDTO
    private DonorDTO convertToDTO(Donor donor) {
        return new DonorDTO(
                donor.getId(),
                donor.getName(),
                donor.getContact(),
                donor.getLocation()
        );
    }
}
