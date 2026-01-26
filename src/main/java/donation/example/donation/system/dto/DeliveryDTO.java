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

    // Donation info
    private Long donationId;
    private String donationName;

    // From Center info
    private Long fromCenterId;
    private String fromCenterName;

    // Driver info
    private Long driverId;
    private String driverName;
    private String driverPhone;

    // Recipient info
    private Long recipientId;
    private String recipientName;
    private String recipientAddress;

    private DeliveryStatus status;
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime scheduledPickupTime;
    private LocalDateTime actualPickupTime;
    private LocalDateTime deliveredTime;
}