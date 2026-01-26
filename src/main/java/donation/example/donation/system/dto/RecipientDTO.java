package donation.example.donation.system.dto;

import donation.example.donation.system.type.RecipientType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipientDTO {
    private Long id;
    private String name;
    private RecipientType type;
    private String address;
    private String contactPerson;
    private String phone;
    private String email;
    private Boolean isActive;
}
