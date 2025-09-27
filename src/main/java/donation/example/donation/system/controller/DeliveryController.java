package donation.example.donation.system.controller;

import donation.example.donation.system.dto.DeliveryDTO;
import donation.example.donation.system.dto.DeliveryRequestDTO;
import donation.example.donation.system.model.CollectionCenter;
import donation.example.donation.system.model.Delivery;
import donation.example.donation.system.model.Donation;
import donation.example.donation.system.repository.CollectionCenterRepository;
import donation.example.donation.system.repository.DeliveryRepository;
import donation.example.donation.system.repository.DonationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    private final DeliveryRepository deliveryRepository;
    private final DonationRepository donationRepository;
    private final CollectionCenterRepository centerRepository;

    public DeliveryController(DeliveryRepository deliveryRepository,
                              DonationRepository donationRepository,
                              CollectionCenterRepository centerRepository) {
        this.deliveryRepository = deliveryRepository;
        this.donationRepository = donationRepository;
        this.centerRepository = centerRepository;
    }

    // Get all deliveries
    @GetMapping
    public List<DeliveryDTO> getAllDeliveries() {
        return deliveryRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Get delivery by ID
    @GetMapping("/{id}")
    public ResponseEntity<DeliveryDTO> getDeliveryById(@PathVariable Long id) {
        return deliveryRepository.findById(id)
                .map(delivery -> ResponseEntity.ok(mapToDTO(delivery)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new delivery
    @PostMapping
    public ResponseEntity<DeliveryDTO> createDelivery(@RequestBody DeliveryRequestDTO request) {
        Donation donation = donationRepository.findById(request.getDonationId())
                .orElseThrow(() -> new RuntimeException("Donation not found"));
        CollectionCenter fromCenter = centerRepository.findById(request.getFromCenterId())
                .orElseThrow(() -> new RuntimeException("Collection Center not found"));

        Delivery delivery = Delivery.builder()
                .donation(donation)
                .fromCenter(fromCenter)
                .destinationAddress(request.getDestinationAddress())
                .driverName(request.getDriverName())
                .status(request.getStatus())
                .pickupTime(request.getPickupTime())
                .deliveryTime(request.getDeliveryTime())
                .build();

        return ResponseEntity.ok(mapToDTO(deliveryRepository.save(delivery)));
    }

    // Update delivery
    @PutMapping("/{id}")
    public ResponseEntity<DeliveryDTO> updateDelivery(@PathVariable Long id,
                                                      @RequestBody DeliveryRequestDTO request) {
        return deliveryRepository.findById(id).map(delivery -> {
            Donation donation = donationRepository.findById(request.getDonationId())
                    .orElseThrow(() -> new RuntimeException("Donation not found"));
            CollectionCenter fromCenter = centerRepository.findById(request.getFromCenterId())
                    .orElseThrow(() -> new RuntimeException("Collection Center not found"));

            delivery.setDonation(donation);
            delivery.setFromCenter(fromCenter);
            delivery.setDestinationAddress(request.getDestinationAddress());
            delivery.setDriverName(request.getDriverName());
            delivery.setStatus(request.getStatus());
            delivery.setPickupTime(request.getPickupTime());
            delivery.setDeliveryTime(request.getDeliveryTime());

            return ResponseEntity.ok(mapToDTO(deliveryRepository.save(delivery)));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete delivery
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable Long id) {
        return deliveryRepository.findById(id).map(delivery -> {
            deliveryRepository.delete(delivery);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private DeliveryDTO mapToDTO(Delivery delivery) {
        return new DeliveryDTO(
                delivery.getId(),
                delivery.getDonation().getId(),
                delivery.getDonation().getItemName(),
                delivery.getFromCenter().getId(),
                delivery.getFromCenter().getName(),
                delivery.getDestinationAddress(),
                delivery.getDriverName(),
                delivery.getStatus(),
                delivery.getPickupTime(),
                delivery.getDeliveryTime()
        );
    }
}