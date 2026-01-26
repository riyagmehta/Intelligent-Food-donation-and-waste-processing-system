package donation.example.donation.system.controller;

import donation.example.donation.system.dto.DeliveryPartnerDTO;
import donation.example.donation.system.mapper.DeliveryPartnerMapper;
import donation.example.donation.system.model.entity.DeliveryPartner;
import donation.example.donation.system.repository.CollectionCenterRepository;
import donation.example.donation.system.repository.DeliveryPartnerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/drivers")
public class DeliveryPartnerController {

    private final DeliveryPartnerRepository driverRepository;
    private final CollectionCenterRepository centerRepository;
    private final DeliveryPartnerMapper driverMapper;

    public DeliveryPartnerController(DeliveryPartnerRepository driverRepository,
                                     CollectionCenterRepository centerRepository,
                                     DeliveryPartnerMapper driverMapper) {
        this.driverRepository = driverRepository;
        this.centerRepository = centerRepository;
        this.driverMapper = driverMapper;
    }

    // Get all drivers
    @GetMapping
    public List<DeliveryPartnerDTO> getAllDrivers() {
        return driverRepository.findAll().stream()
                .map(driverMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get driver by ID
    @GetMapping("/{id}")
    public ResponseEntity<DeliveryPartnerDTO> getDriverById(@PathVariable Long id) {
        return driverRepository.findById(id)
                .map(driver -> ResponseEntity.ok(driverMapper.toDTO(driver)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Get current driver's profile
    @GetMapping("/me")
    public ResponseEntity<DeliveryPartnerDTO> getMyProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return driverRepository.findByUserUsername(username)
                .map(driver -> ResponseEntity.ok(driverMapper.toDTO(driver)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Get available drivers for a center
    @GetMapping("/center/{centerId}/available")
    public List<DeliveryPartnerDTO> getAvailableDriversForCenter(@PathVariable Long centerId) {
        return driverRepository.findByCollectionCenterIdAndIsAvailableTrue(centerId).stream()
                .map(driverMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get all drivers for a center
    @GetMapping("/center/{centerId}")
    public List<DeliveryPartnerDTO> getDriversForCenter(@PathVariable Long centerId) {
        return driverRepository.findByCollectionCenterId(centerId).stream()
                .map(driverMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Update driver availability
    @PutMapping("/{id}/availability")
    public ResponseEntity<DeliveryPartnerDTO> updateAvailability(@PathVariable Long id,
                                                                  @RequestBody Boolean isAvailable) {
        return driverRepository.findById(id).map(driver -> {
            driver.setIsAvailable(isAvailable);
            DeliveryPartner saved = driverRepository.save(driver);
            return ResponseEntity.ok(driverMapper.toDTO(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Update my availability (for driver)
    @PutMapping("/me/availability")
    public ResponseEntity<DeliveryPartnerDTO> updateMyAvailability(@RequestBody Boolean isAvailable) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return driverRepository.findByUserUsername(username).map(driver -> {
            driver.setIsAvailable(isAvailable);
            DeliveryPartner saved = driverRepository.save(driver);
            return ResponseEntity.ok(driverMapper.toDTO(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Assign driver to a center
    @PutMapping("/{driverId}/assign-center/{centerId}")
    public ResponseEntity<DeliveryPartnerDTO> assignToCenter(@PathVariable Long driverId,
                                                              @PathVariable Long centerId) {
        return driverRepository.findById(driverId).map(driver -> {
            return centerRepository.findById(centerId).map(center -> {
                driver.setCollectionCenter(center);
                DeliveryPartner saved = driverRepository.save(driver);
                return ResponseEntity.ok(driverMapper.toDTO(saved));
            }).orElse(ResponseEntity.notFound().build());
        }).orElse(ResponseEntity.notFound().build());
    }

    // Update driver profile
    @PutMapping("/{id}")
    public ResponseEntity<DeliveryPartnerDTO> updateDriver(@PathVariable Long id,
                                                           @RequestBody DeliveryPartnerDTO dto) {
        return driverRepository.findById(id).map(driver -> {
            if (dto.getName() != null) driver.setName(dto.getName());
            if (dto.getPhone() != null) driver.setPhone(dto.getPhone());
            if (dto.getVehicleNumber() != null) driver.setVehicleNumber(dto.getVehicleNumber());
            if (dto.getVehicleType() != null) driver.setVehicleType(dto.getVehicleType());
            DeliveryPartner saved = driverRepository.save(driver);
            return ResponseEntity.ok(driverMapper.toDTO(saved));
        }).orElse(ResponseEntity.notFound().build());
    }
}
