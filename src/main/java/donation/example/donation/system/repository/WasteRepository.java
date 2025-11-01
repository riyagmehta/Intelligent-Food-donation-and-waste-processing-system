package donation.example.donation.system.repository;

import donation.example.donation.system.model.entity.Waste;
import donation.example.donation.system.type.WasteStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WasteRepository extends JpaRepository<Waste, Long> {
    List<Waste> findByStatus(WasteStatus status);
    List<Waste> findByCollectionCenterId(Long centerId);
    List<Waste> findByDonationId(Long donationId);
}