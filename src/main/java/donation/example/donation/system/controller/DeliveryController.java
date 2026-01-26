package donation.example.donation.system.controller;

import donation.example.donation.system.dto.CreateDeliveryRequest;
import donation.example.donation.system.dto.DeliveryDTO;
import donation.example.donation.system.mapper.DeliveryMapper;
import donation.example.donation.system.model.entity.*;
import donation.example.donation.system.type.DeliveryStatus;
import donation.example.donation.system.type.DonationStatus;
import donation.example.donation.system.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    private final DeliveryRepository deliveryRepository;
    private final DonationRepository donationRepository;
    private final CollectionCenterRepository centerRepository;
    private final DeliveryPartnerRepository driverRepository;
    private final RecipientRepository recipientRepository;
    private final DeliveryMapper deliveryMapper;

    public DeliveryController(DeliveryRepository deliveryRepository,
                              DonationRepository donationRepository,
                              CollectionCenterRepository centerRepository,
                              DeliveryPartnerRepository driverRepository,
                              RecipientRepository recipientRepository,
                              DeliveryMapper deliveryMapper) {
        this.deliveryRepository = deliveryRepository;
        this.donationRepository = donationRepository;
        this.centerRepository = centerRepository;
        this.driverRepository = driverRepository;
        this.recipientRepository = recipientRepository;
        this.deliveryMapper = deliveryMapper;
    }

    // Get all deliveries
    @GetMapping
    public List<DeliveryDTO> getAllDeliveries() {
        return deliveryRepository.findAll().stream()
                .map(deliveryMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get delivery by ID
    @GetMapping("/{id}")
    public ResponseEntity<DeliveryDTO> getDeliveryById(@PathVariable Long id) {
        return deliveryRepository.findById(id)
                .map(delivery -> ResponseEntity.ok(deliveryMapper.toDTO(delivery)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Get deliveries for current driver
    @GetMapping("/my")
    public ResponseEntity<List<DeliveryDTO>> getMyDeliveries() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return driverRepository.findByUserUsername(username)
                .map(driver -> {
                    List<DeliveryDTO> deliveries = deliveryRepository.findByDriverId(driver.getId())
                            .stream()
                            .map(deliveryMapper::toDTO)
                            .collect(Collectors.toList());
                    return ResponseEntity.ok(deliveries);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Get pending/assigned deliveries for current driver
    @GetMapping("/my/pending")
    public ResponseEntity<List<DeliveryDTO>> getMyPendingDeliveries() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return driverRepository.findByUserUsername(username)
                .map(driver -> {
                    List<DeliveryDTO> deliveries = deliveryRepository
                            .findByDriverIdAndStatus(driver.getId(), DeliveryStatus.ASSIGNED)
                            .stream()
                            .map(deliveryMapper::toDTO)
                            .collect(Collectors.toList());
                    return ResponseEntity.ok(deliveries);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Get deliveries for a center
    @GetMapping("/center/{centerId}")
    public List<DeliveryDTO> getDeliveriesForCenter(@PathVariable Long centerId) {
        return deliveryRepository.findByFromCenterId(centerId).stream()
                .map(deliveryMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Create new delivery (Staff assigns driver and recipient)
    @PostMapping
    public ResponseEntity<DeliveryDTO> createDelivery(@RequestBody CreateDeliveryRequest request) {
        // Get donation
        Donation donation = donationRepository.findById(request.getDonationId())
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        // Verify donation is in COLLECTED status
        if (donation.getStatus() != DonationStatus.COLLECTED) {
            throw new RuntimeException("Donation must be in COLLECTED status to create delivery");
        }

        // Get driver
        DeliveryPartner driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        // Get recipient
        Recipient recipient = recipientRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        // Create delivery
        Delivery delivery = new Delivery();
        delivery.setDonation(donation);
        delivery.setFromCenter(donation.getCollectionCenter());
        delivery.setDriver(driver);
        delivery.setRecipient(recipient);
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        delivery.setScheduledPickupTime(request.getScheduledPickupTime());
        delivery.setNotes(request.getNotes());
        delivery.setCreatedAt(LocalDateTime.now());

        Delivery saved = deliveryRepository.save(delivery);

        // Update donation status to ASSIGNED
        donation.setStatus(DonationStatus.ASSIGNED);
        donationRepository.save(donation);

        return ResponseEntity.ok(deliveryMapper.toDTO(saved));
    }

    // Driver picks up the delivery
    @PutMapping("/{id}/pickup")
    public ResponseEntity<DeliveryDTO> pickupDelivery(@PathVariable Long id) {
        return deliveryRepository.findById(id).map(delivery -> {
            if (delivery.getStatus() != DeliveryStatus.ASSIGNED) {
                throw new RuntimeException("Delivery must be in ASSIGNED status to pick up");
            }

            delivery.setStatus(DeliveryStatus.PICKED_UP);
            delivery.setActualPickupTime(LocalDateTime.now());
            Delivery saved = deliveryRepository.save(delivery);

            // Update donation status
            Donation donation = delivery.getDonation();
            donation.setStatus(DonationStatus.IN_TRANSIT);
            donationRepository.save(donation);

            return ResponseEntity.ok(deliveryMapper.toDTO(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Driver marks as in transit
    @PutMapping("/{id}/in-transit")
    public ResponseEntity<DeliveryDTO> markInTransit(@PathVariable Long id) {
        return deliveryRepository.findById(id).map(delivery -> {
            delivery.setStatus(DeliveryStatus.IN_TRANSIT);
            Delivery saved = deliveryRepository.save(delivery);
            return ResponseEntity.ok(deliveryMapper.toDTO(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Driver completes delivery
    @PutMapping("/{id}/complete")
    public ResponseEntity<DeliveryDTO> completeDelivery(@PathVariable Long id) {
        return deliveryRepository.findById(id).map(delivery -> {
            delivery.setStatus(DeliveryStatus.DELIVERED);
            delivery.setDeliveredTime(LocalDateTime.now());
            Delivery saved = deliveryRepository.save(delivery);

            // Update donation status
            Donation donation = delivery.getDonation();
            donation.setStatus(DonationStatus.DELIVERED);
            donationRepository.save(donation);

            // Mark driver as available again
            DeliveryPartner driver = delivery.getDriver();
            if (driver != null) {
                driver.setIsAvailable(true);
                driverRepository.save(driver);
            }

            return ResponseEntity.ok(deliveryMapper.toDTO(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Cancel delivery
    @PutMapping("/{id}/cancel")
    public ResponseEntity<DeliveryDTO> cancelDelivery(@PathVariable Long id) {
        return deliveryRepository.findById(id).map(delivery -> {
            delivery.setStatus(DeliveryStatus.CANCELLED);
            Delivery saved = deliveryRepository.save(delivery);

            // Revert donation status to COLLECTED
            Donation donation = delivery.getDonation();
            donation.setStatus(DonationStatus.COLLECTED);
            donationRepository.save(donation);

            // Mark driver as available
            DeliveryPartner driver = delivery.getDriver();
            if (driver != null) {
                driver.setIsAvailable(true);
                driverRepository.save(driver);
            }

            return ResponseEntity.ok(deliveryMapper.toDTO(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete delivery
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable Long id) {
        return deliveryRepository.findById(id).map(delivery -> {
            // Revert donation status
            Donation donation = delivery.getDonation();
            donation.setStatus(DonationStatus.COLLECTED);
            donationRepository.save(donation);

            deliveryRepository.delete(delivery);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
