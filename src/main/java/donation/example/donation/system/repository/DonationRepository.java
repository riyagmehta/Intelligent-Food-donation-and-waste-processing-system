package donation.example.donation.system.repository;

import donation.example.donation.system.model.entity.Donation;
import donation.example.donation.system.type.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByStatus(DonationStatus status);
    List<Donation> findByDonorId(Long donorId);
    List<Donation> findByCollectionCenterIdAndStatus(Long centerId, DonationStatus status);
    List<Donation> findByCollectionCenterId(Long centerId);
}
