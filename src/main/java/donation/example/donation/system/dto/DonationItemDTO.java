package donation.example.donation.system.dto;

import donation.example.donation.system.type.Unit;
import donation.example.donation.system.type.WasteStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonationItemDTO {

    private Long id;
    private String itemName;
    private Integer quantity;
    private Unit unit;
    private LocalDateTime wasteDate;
    private WasteStatus status;
    private Long donationId;
    private Long collectionCenterId;
}