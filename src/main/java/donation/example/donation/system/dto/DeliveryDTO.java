package donation.example.donation.system.dto;

import donation.example.donation.system.type.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryDTO {
    private Long id;
    private Long donationId;
    private String donationItemName;
    private Long fromCenterId;
    private String fromCenterName;
    private String destinationAddress;
    private String driverName;
    private DeliveryStatus status;
    private LocalDateTime pickupTime;
    private LocalDateTime deliveryTime;
}