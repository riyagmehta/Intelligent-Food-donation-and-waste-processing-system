package donation.example.donation.system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPartnerDTO {
    private Long id;
    private String name;
    private String phone;
    private String vehicleNumber;
    private String vehicleType;
    private Boolean isAvailable;
    private Long collectionCenterId;
    private String collectionCenterName;
    private UserDTO user;
}
