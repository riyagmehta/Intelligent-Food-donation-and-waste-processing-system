package donation.example.donation.system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDeliveryRequest {
    private Long donationId;
    private Long driverId;
    private Long recipientId;
    private LocalDateTime scheduledPickupTime;
    private String notes;
}
