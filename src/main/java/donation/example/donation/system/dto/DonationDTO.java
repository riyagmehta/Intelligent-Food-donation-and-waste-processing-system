package donation.example.donation.system.dto;

import donation.example.donation.system.type.DonationType;
import donation.example.donation.system.type.Unit;
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
    private DonorDTO donor;
    private DonationType donationType;
    private CollectionCenterDTO collectionCenter;
}