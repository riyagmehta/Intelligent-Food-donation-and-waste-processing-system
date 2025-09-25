package donation.example.donation.system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonationDTO {
    private Long id;
    private String itemName;
    private Integer quantity;
    private String unit;
    private LocalDateTime donationDate;
    private String status;
    private Long donorId;
    private CollectionCenterDTO collectionCenter; // can be null if not assigned
}