package donation.example.donation.system.model.entity;

import donation.example.donation.system.type.RecipientType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recipient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private RecipientType type;

    private String address;
    private String contactPerson;
    private String phone;
    private String email;

    private Boolean isActive = true;

    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL)
    private List<Delivery> deliveries = new ArrayList<>();
}
