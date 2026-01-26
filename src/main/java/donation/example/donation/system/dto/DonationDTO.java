package donation.example.donation.system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonationDTO {
    private Long id;
    private String name;
    private LocalDateTime donationDate;
    private String status;
    private DonorDTO donor;
    private CollectionCenterDTO collectionCenter;
    private List<DonationItemDTO> donationItems;
}