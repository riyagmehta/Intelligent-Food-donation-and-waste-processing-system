package donation.example.donation.system.dto;

import donation.example.donation.system.type.DeliveryStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DeliveryRequestDTO {
    private Long donationId;
    private Long fromCenterId;
    private String destinationAddress;
    private String driverName;
    private DeliveryStatus status;
    private LocalDateTime pickupTime;
    private LocalDateTime deliveryTime;
}