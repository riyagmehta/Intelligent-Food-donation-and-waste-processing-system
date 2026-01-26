package donation.example.donation.system.controller;

import donation.example.donation.system.dto.DonationItemDTO;
import donation.example.donation.system.mapper.DonationItemMapper;
import donation.example.donation.system.model.entity.CollectionCenter;
import donation.example.donation.system.model.entity.Donation;
import donation.example.donation.system.model.entity.DonationItem;
import donation.example.donation.system.repository.CollectionCenterRepository;
import donation.example.donation.system.repository.DonationRepository;
import donation.example.donation.system.repository.DonationItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // Create a new donation item
    @PostMapping
    public ResponseEntity<DonationItemDTO> createDonationItem(@RequestBody DonationItemDTO request) {
        Donation donation = donationRepository.findById(request.getDonationId())
                .orElseThrow(() -> new RuntimeException("Donation not found with id: " + request.getDonationId()));

        CollectionCenter center = centerRepository.findById(request.getCollectionCenterId())
                .orElseThrow(() -> new RuntimeException("Center not found with id: " + request.getCollectionCenterId()));

        DonationItem donationItem = new DonationItem();
        donationItem.setName(request.getItemName());
        donationItem.setQuantity(request.getQuantity());
        donationItem.setUnit(request.getUnit());
        donationItem.setType(request.getType());
        donationItem.setDonation(donation);
        donationItem.setCollectionCenter(center);

        DonationItem savedDonationItem = donationItemRepository.save(donationItem);
        return ResponseEntity.ok(donationItemMapper.toDTO(savedDonationItem));
    }

    // Get all donation items
    @GetMapping
    public List<DonationItemDTO> getAllDonationItems() {
        return donationItemRepository.findAll().stream().map(donationItemMapper::toDTO).collect(Collectors.toList());
    }

    // Get donation items by donation ID
    @GetMapping("/donation/{donationId}")
    public List<DonationItemDTO> getItemsByDonation(@PathVariable Long donationId) {
        return donationItemRepository.findByDonationId(donationId).stream()
                .map(donationItemMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Delete a donation item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonationItem(@PathVariable Long id) {
        return donationItemRepository.findById(id).map(item -> {
            donationItemRepository.delete(item);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

}