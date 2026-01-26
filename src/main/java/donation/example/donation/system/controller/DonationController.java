package donation.example.donation.system.controller;

import donation.example.donation.system.dto.DonationDTO;
import donation.example.donation.system.dto.DonationRequestDTO;
import donation.example.donation.system.mapper.DonationMapper;
import donation.example.donation.system.model.entity.CollectionCenter;
import donation.example.donation.system.model.entity.Donation;
import donation.example.donation.system.type.DonationStatus;
import donation.example.donation.system.repository.CollectionCenterRepository;
import donation.example.donation.system.repository.DonationRepository;
import donation.example.donation.system.repository.DonorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationRepository donationRepository;
    private final DonorRepository donorRepository;
    private final CollectionCenterRepository centerRepository;
    private final DonationMapper donationMapper;

    public DonationController(DonationRepository donationRepository,
                              DonorRepository donorRepository,
                              CollectionCenterRepository centerRepository,
                              DonationMapper donationMapper) {
        this.donationRepository = donationRepository;
        this.donorRepository = donorRepository;
        this.centerRepository = centerRepository;
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

    // ==================== DONOR ENDPOINTS ====================

    // Get current donor's donations (for logged-in donor)
    @GetMapping("/my")
    public ResponseEntity<List<DonationDTO>> getMyDonations() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return donorRepository.findByUserUsername(username)
                .map(donor -> {
                    List<DonationDTO> donations = donationRepository.findByDonorId(donor.getId())
                            .stream()
                            .map(donationMapper::donationToDonationDTO)
                            .collect(Collectors.toList());
                    return ResponseEntity.ok(donations);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Create donation for current logged-in donor
    @PostMapping("/my")
    public ResponseEntity<DonationDTO> createMyDonation(@RequestBody DonationRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return donorRepository.findByUserUsername(username)
                .map(donor -> {
                    CollectionCenter center = centerRepository.findById(request.getCollectionCenterId())
                            .orElseThrow(() -> new RuntimeException("Collection Center not found"));

                    Donation donation = new Donation();
                    donation.setName(request.getName());
                    donation.setDonor(donor);
                    donation.setCollectionCenter(center);
                    donation.setStatus(DonationStatus.PENDING);

                    return ResponseEntity.ok(donationMapper.donationToDonationDTO(donationRepository.save(donation)));
                })
                .orElseThrow(() -> new RuntimeException("Donor profile not found. Please create a donor profile first."));
    }

    // Create new donation with collection center assignment (legacy - requires donorId)
    @PostMapping("/donor/{donorId}")
    public ResponseEntity<DonationDTO> createDonation(@PathVariable Long donorId,
                                                       @RequestBody DonationRequestDTO request) {
        return donorRepository.findById(donorId).map(donor -> {
            // Find the collection center
            CollectionCenter center = centerRepository.findById(request.getCollectionCenterId())
                    .orElseThrow(() -> new RuntimeException("Collection Center not found"));

            // Create donation with PENDING status
            Donation donation = new Donation();
            donation.setName(request.getName());
            donation.setDonor(donor);
            donation.setCollectionCenter(center);
            donation.setStatus(DonationStatus.PENDING);

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

    // ==================== STAFF ENDPOINTS ====================

    // Get pending donations for current staff's collection center
    @GetMapping("/center/pending")
    public ResponseEntity<List<DonationDTO>> getPendingDonationsForMyCenter() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        CollectionCenter center = centerRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("No collection center assigned to this user"));

        List<DonationDTO> pendingDonations = donationRepository
                .findByCollectionCenterIdAndStatus(center.getId(), DonationStatus.PENDING)
                .stream()
                .map(donationMapper::donationToDonationDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(pendingDonations);
    }

    // Get all donations for current staff's collection center
    @GetMapping("/center/all")
    public ResponseEntity<List<DonationDTO>> getAllDonationsForMyCenter() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        CollectionCenter center = centerRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("No collection center assigned to this user"));

        List<DonationDTO> donations = donationRepository
                .findByCollectionCenterId(center.getId())
                .stream()
                .map(donationMapper::donationToDonationDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(donations);
    }

    // Staff accepts a donation - changes status to COLLECTED
    @PutMapping("/{id}/accept")
    public ResponseEntity<DonationDTO> acceptDonation(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        // Get the staff's collection center
        CollectionCenter staffCenter = centerRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("No collection center assigned to this user"));

        return donationRepository.findById(id).map(donation -> {
            // Verify donation belongs to staff's center
            if (donation.getCollectionCenter() == null ||
                !donation.getCollectionCenter().getId().equals(staffCenter.getId())) {
                throw new RuntimeException("Donation does not belong to your collection center");
            }

            // Verify donation is in PENDING status
            if (donation.getStatus() != DonationStatus.PENDING) {
                throw new RuntimeException("Can only accept donations with PENDING status");
            }

            donation.setStatus(DonationStatus.COLLECTED);
            return ResponseEntity.ok(donationMapper.donationToDonationDTO(donationRepository.save(donation)));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Staff rejects a donation
    @PutMapping("/{id}/reject")
    public ResponseEntity<DonationDTO> rejectDonation(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        // Get the staff's collection center
        CollectionCenter staffCenter = centerRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("No collection center assigned to this user"));

        return donationRepository.findById(id).map(donation -> {
            // Verify donation belongs to staff's center
            if (donation.getCollectionCenter() == null ||
                !donation.getCollectionCenter().getId().equals(staffCenter.getId())) {
                throw new RuntimeException("Donation does not belong to your collection center");
            }

            // Verify donation is in PENDING status
            if (donation.getStatus() != DonationStatus.PENDING) {
                throw new RuntimeException("Can only reject donations with PENDING status");
            }

            donation.setStatus(DonationStatus.REJECTED);
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
