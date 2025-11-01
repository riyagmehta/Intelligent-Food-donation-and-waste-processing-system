package donation.example.donation.system.controller;

import donation.example.donation.system.dto.DonorDTO;
import donation.example.donation.system.mapper.DonorMapper;
import donation.example.donation.system.model.entity.User;
import donation.example.donation.system.repository.UserRepository;
import donation.example.donation.system.type.DonationType;
import donation.example.donation.system.model.entity.Donor;
import donation.example.donation.system.repository.DonorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorRepository donorRepository;

    private final UserRepository userRepository;

    private final DonorMapper donorMapper;

    public DonorController(DonorRepository donorRepository, UserRepository userRepository, DonorMapper donorMapper) {
        this.donorRepository = donorRepository;
        this.userRepository = userRepository;
        this.donorMapper = donorMapper;
    }

    // Get all donors
    @GetMapping
    public List<DonorDTO> getAllDonors() {
        return donorRepository.findAll()
                .stream()
                .map(donorMapper::donorToDonorDTO)
                .collect(Collectors.toList());
    }

    // Get donor by ID
    @GetMapping("/{id}")
    public ResponseEntity<DonorDTO> getDonorById(@PathVariable Long id) {
        return donorRepository.findById(id)
                .map(donor -> ResponseEntity.ok(donorMapper.donorToDonorDTO(donor)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-type/{type}")
    public List<DonorDTO> getDonorsByDonationType(@PathVariable DonationType type) {
        return donorRepository.findByDonationType(type).stream()
                .map(donorMapper::donorToDonorDTO)
                .collect(Collectors.toList());
    }

    // Create new donor
    @PostMapping
    public DonorDTO createDonor(@RequestBody Donor donor) {
        User user = userRepository.save(donor.getUser());
        donor.setUser(user);
        Donor saved = donorRepository.save(donor);
        return donorMapper.donorToDonorDTO(saved);
    }

    // Update donor
    @PutMapping("/{id}")
    public ResponseEntity<DonorDTO> updateDonor(@PathVariable Long id, @RequestBody Donor donorDetails) {
        return donorRepository.findById(id).map(donor -> {
            donor.setName(donorDetails.getName());
            donor.setContact(donorDetails.getContact());
            donor.setLocation(donorDetails.getLocation());
            Donor updated = donorRepository.save(donor);
            return ResponseEntity.ok(donorMapper.donorToDonorDTO(updated));
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
