package donation.example.donation.system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectionCenterDTO {
    private Long id;
    private String name;
    private String location;
    private Integer maxCapacity;
    private Integer currentLoad;
    private UserDTO user;
}