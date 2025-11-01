package donation.example.donation.system.controller;

import donation.example.donation.system.dto.WasteDTO;
import donation.example.donation.system.mapper.WasteMapper;
import donation.example.donation.system.model.entity.CollectionCenter;
import donation.example.donation.system.model.entity.Donation;
import donation.example.donation.system.model.entity.Waste;
import donation.example.donation.system.type.WasteStatus;
import donation.example.donation.system.repository.CollectionCenterRepository;
import donation.example.donation.system.repository.DonationRepository;
import donation.example.donation.system.repository.WasteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/waste")
public class WasteController {

    private final WasteRepository wasteRepository;
    private final DonationRepository donationRepository;
    private final CollectionCenterRepository centerRepository;
    private final WasteMapper wasteMapper;

    public WasteController(WasteRepository wasteRepository,
                           DonationRepository donationRepository,
                           CollectionCenterRepository centerRepository,
                           WasteMapper wasteMapper) {
        this.wasteRepository = wasteRepository;
        this.donationRepository = donationRepository;
        this.centerRepository = centerRepository;
        this.wasteMapper = wasteMapper;
    }

    // Create a new waste record
    @PostMapping
    public ResponseEntity<WasteDTO> createWasteRecord(@RequestBody WasteDTO request) {
        Donation donation = donationRepository.findById(request.getDonationId())
                .orElseThrow(() -> new RuntimeException("Donation not found with id: " + request.getDonationId()));

        CollectionCenter center = centerRepository.findById(request.getCollectionCenterId())
                .orElseThrow(() -> new RuntimeException("Center not found with id: " + request.getCollectionCenterId()));

        Waste waste = new Waste();
        waste.setItemName(request.getItemName());
        waste.setQuantity(request.getQuantity());
        waste.setUnit(request.getUnit());
        waste.setStatus(WasteStatus.PENDING);
        waste.setWasteDate(LocalDateTime.now());
        waste.setDonation(donation);
        waste.setCollectionCenter(center);

        Waste savedWaste = wasteRepository.save(waste);
        return ResponseEntity.ok(wasteMapper.toDTO(savedWaste));
    }

    // Get all waste records
    @GetMapping
    public List<WasteDTO> getAllWaste() {
        return wasteRepository.findAll().stream().map(wasteMapper::toDTO).collect(Collectors.toList());
    }

    // Get waste records by status
    @GetMapping("/status/{status}")
    public List<WasteDTO> getWasteByStatus(@PathVariable WasteStatus status) {
        return wasteRepository.findByStatus(status).stream().map(wasteMapper::toDTO).collect(Collectors.toList());
    }

    // Update the status of a waste record
    @PutMapping("/{id}/status")
    public ResponseEntity<WasteDTO> updateWasteStatus(@PathVariable Long id, @RequestBody WasteStatus status) {
        return wasteRepository.findById(id).map(waste -> {
            waste.setStatus(status);
            Waste updatedWaste = wasteRepository.save(waste);
            return ResponseEntity.ok(wasteMapper.toDTO(updatedWaste));
        }).orElse(ResponseEntity.notFound().build());
    }

}