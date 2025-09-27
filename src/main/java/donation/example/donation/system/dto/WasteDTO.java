package donation.example.donation.system.dto;

import donation.example.donation.system.model.WasteStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WasteDTO {

    private Long id;
    private String itemName;
    private Integer quantity;
    private String unit;
    private LocalDateTime wasteDate;
    private WasteStatus status;
    private Long donationId;
    private Long collectionCenterId;
}