package donation.example.donation.system.dto;

import donation.example.donation.system.type.DonationType;
import donation.example.donation.system.type.Unit;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonationItemDTO {

    private Long id;
    private String itemName;  // Maps from entity's 'name' field
    private Integer quantity;
    private Unit unit;
    private DonationType type;
    private Long donationId;
    private Long collectionCenterId;
}