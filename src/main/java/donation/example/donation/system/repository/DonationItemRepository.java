package donation.example.donation.system.repository;

import donation.example.donation.system.model.entity.DonationItem;
import donation.example.donation.system.type.WasteStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationItemRepository extends JpaRepository<DonationItem, Long> {
    List<DonationItem> findByStatus(WasteStatus status);
    List<DonationItem> findByCollectionCenterId(Long centerId);
    List<DonationItem> findByDonationId(Long donationId);
}