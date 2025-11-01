package donation.example.donation.system.controller;

import donation.example.donation.system.dto.DonationItemDTO;
import donation.example.donation.system.mapper.DonationItemMapper;
import donation.example.donation.system.model.entity.CollectionCenter;
import donation.example.donation.system.model.entity.Donation;
import donation.example.donation.system.model.entity.DonationItem;
import donation.example.donation.system.type.WasteStatus;
import donation.example.donation.system.repository.CollectionCenterRepository;
import donation.example.donation.system.repository.DonationRepository;
import donation.example.donation.system.repository.DonationItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/donations/item")
public class DonationItemController {

    private final DonationItemRepository donationItemRepository;
    private final DonationRepository donationRepository;
    private final CollectionCenterRepository centerRepository;
    private final DonationItemMapper donationItemMapper;

    public DonationItemController(DonationItemRepository donationItemRepository,
                                  DonationRepository donationRepository,
                                  CollectionCenterRepository centerRepository,
                                  DonationItemMapper donationItemMapper) {
        this.donationItemRepository = donationItemRepository;
        this.donationRepository = donationRepository;
        this.centerRepository = centerRepository;
        this.donationItemMapper = donationItemMapper;
    }

    // Create a new waste record
    @PostMapping
    public ResponseEntity<DonationItemDTO> createWasteRecord(@RequestBody DonationItemDTO request) {
        Donation donation = donationRepository.findById(request.getDonationId())
                .orElseThrow(() -> new RuntimeException("Donation not found with id: " + request.getDonationId()));

        CollectionCenter center = centerRepository.findById(request.getCollectionCenterId())
                .orElseThrow(() -> new RuntimeException("Center not found with id: " + request.getCollectionCenterId()));

        DonationItem donationItem = new DonationItem();
        donationItem.setName(request.getItemName());
        donationItem.setQuantity(request.getQuantity());
        donationItem.setUnit(request.getUnit());
        donationItem.setStatus(WasteStatus.PENDING);
        donationItem.setWasteDate(LocalDateTime.now());
        donationItem.setDonation(donation);
        donationItem.setCollectionCenter(center);

        DonationItem savedDonationItem = donationItemRepository.save(donationItem);
        return ResponseEntity.ok(donationItemMapper.toDTO(savedDonationItem));
    }

    // Get all waste records
    @GetMapping
    public List<DonationItemDTO> getAllWaste() {
        return donationItemRepository.findAll().stream().map(donationItemMapper::toDTO).collect(Collectors.toList());
    }

    // Get waste records by status
    @GetMapping("/status/{status}")
    public List<DonationItemDTO> getWasteByStatus(@PathVariable WasteStatus status) {
        return donationItemRepository.findByStatus(status).stream().map(donationItemMapper::toDTO).collect(Collectors.toList());
    }

    // Update the status of a waste record
    @PutMapping("/{id}/status")
    public ResponseEntity<DonationItemDTO> updateWasteStatus(@PathVariable Long id, @RequestBody WasteStatus status) {
        return donationItemRepository.findById(id).map(waste -> {
            waste.setStatus(status);
            DonationItem updatedDonationItem = donationItemRepository.save(waste);
            return ResponseEntity.ok(donationItemMapper.toDTO(updatedDonationItem));
        }).orElse(ResponseEntity.notFound().build());
    }

}