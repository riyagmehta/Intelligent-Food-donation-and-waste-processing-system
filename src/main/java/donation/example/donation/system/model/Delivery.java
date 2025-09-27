package donation.example.donation.system.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;

    @ManyToOne
    @JoinColumn(name = "from_center_id", nullable = false)
    private CollectionCenter fromCenter;

    private String destinationAddress;
    private String driverName;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;

    private LocalDateTime pickupTime;
    private LocalDateTime deliveryTime;
}