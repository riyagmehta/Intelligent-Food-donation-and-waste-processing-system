package donation.example.donation.system.model.entity;

import donation.example.donation.system.type.Unit;
import donation.example.donation.system.type.WasteStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Waste {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    private Unit unit;

    private LocalDateTime wasteDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private WasteStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donation_id")
    private Donation donation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_center_id")
    private CollectionCenter collectionCenter;
}