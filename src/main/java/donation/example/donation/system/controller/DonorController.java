package donation.example.donation.system.controller;

import donation.example.donation.system.model.Donor;
import donation.example.donation.system.model.DonorType;
import donation.example.donation.system.repository.DonorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorRepository donorRepository;

    public DonorController(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    // Get all donors
    @GetMapping
    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    // Get donor by ID
    @GetMapping("/{id}")
    public ResponseEntity<Donor> getDonorById(@PathVariable Long id) {
        return donorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get donors by type
    @GetMapping("/type/{type}")
    public List<Donor> getDonorsByType(@PathVariable DonorType type) {
        return donorRepository.findByType(type);
    }

    // Create new donor
    @PostMapping
    public Donor createDonor(@RequestBody Donor donor) {
        return donorRepository.save(donor);
    }

    // Update donor
    @PutMapping("/{id}")
    public ResponseEntity<Donor> updateDonor(@PathVariable Long id, @RequestBody Donor donorDetails) {
        return donorRepository.findById(id).map(donor -> {
            donor.setName(donorDetails.getName());
            donor.setContact(donorDetails.getContact());
            donor.setLocation(donorDetails.getLocation());
            donor.setType(donorDetails.getType());
            return ResponseEntity.ok(donorRepository.save(donor));
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
}
