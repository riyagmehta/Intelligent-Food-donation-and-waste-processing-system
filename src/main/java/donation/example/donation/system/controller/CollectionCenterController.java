package donation.example.donation.system.controller;

import donation.example.donation.system.dto.CollectionCenterDTO;
import donation.example.donation.system.model.entity.CollectionCenter;
import donation.example.donation.system.model.entity.Donation;
import donation.example.donation.system.model.entity.User;
import donation.example.donation.system.repository.CollectionCenterRepository;
import donation.example.donation.system.repository.DonationRepository;
import donation.example.donation.system.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/centers")
public class CollectionCenterController {

    private final CollectionCenterRepository centerRepository;
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    public CollectionCenterController(CollectionCenterRepository centerRepository,
                                      DonationRepository donationRepository,
                                      UserRepository userRepository) {
        this.centerRepository = centerRepository;
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
    }

    // Get all centers
    @GetMapping
    public List<CollectionCenterDTO> getAllCenters() {
        return centerRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Get center by ID
    @GetMapping("/{id}")
    public ResponseEntity<CollectionCenterDTO> getCenterById(@PathVariable Long id) {
        return centerRepository.findById(id)
                .map(center -> ResponseEntity.ok(mapToDTO(center)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new center
    @PostMapping
    public CollectionCenterDTO createCenter(@RequestBody CollectionCenter center) {
        User user = userRepository.save(center.getUser());
        center.setUser(user);
        return mapToDTO(centerRepository.save(center));
    }

    // Update a center
    @PutMapping("/{id}")
    public ResponseEntity<CollectionCenterDTO> updateCenter(@PathVariable Long id,
                                                            @RequestBody CollectionCenter details) {
        return centerRepository.findById(id).map(center -> {
            center.setName(details.getName());
            center.setLocation(details.getLocation());
            center.setMaxCapacity(details.getMaxCapacity());
            return ResponseEntity.ok(mapToDTO(centerRepository.save(center)));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete a center
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCenter(@PathVariable Long id) {
        return centerRepository.findById(id).map(center -> {
            centerRepository.delete(center);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Assign a donation to a center (with capacity check)
    @PutMapping("/{centerId}/assign/{donationId}")
    public ResponseEntity<CollectionCenterDTO> assignDonationToCenter(
            @PathVariable Long centerId,
            @PathVariable Long donationId) {

        CollectionCenter center = centerRepository.findById(centerId)
                .orElseThrow(() -> new RuntimeException("Center not found"));

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        int newLoad = center.getCurrentLoad() + donation.getQuantity();
        if (newLoad > center.getMaxCapacity()) {
            throw new RuntimeException("Center capacity exceeded");
        }

        donation.setCollectionCenter(center);
        if (!center.getDonations().contains(donation)) {
            center.getDonations().add(donation);
        }
        center.setCurrentLoad(newLoad);

        donationRepository.save(donation);
        return ResponseEntity.ok(mapToDTO(centerRepository.save(center)));
    }

    private CollectionCenterDTO mapToDTO(CollectionCenter center) {
        return new CollectionCenterDTO(
                center.getId(),
                center.getName(),
                center.getLocation(),
                center.getMaxCapacity(),
                center.getCurrentLoad()
        );
    }
}
