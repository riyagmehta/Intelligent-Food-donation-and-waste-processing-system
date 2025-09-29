package donation.example.donation.system.dto;

import donation.example.donation.system.model.DonationType;
import donation.example.donation.system.model.Unit;
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
    private Unit unit;
    private LocalDateTime donationDate;
    private String status;
    private Long donorId;
    private DonationType donationType;
    private CollectionCenterDTO collectionCenter;
}