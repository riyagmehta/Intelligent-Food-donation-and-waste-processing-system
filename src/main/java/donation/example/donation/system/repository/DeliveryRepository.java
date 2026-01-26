package donation.example.donation.system.repository;

import donation.example.donation.system.model.entity.Delivery;
import donation.example.donation.system.type.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByDriverId(Long driverId);
    List<Delivery> findByDriverIdAndStatus(Long driverId, DeliveryStatus status);
    List<Delivery> findByFromCenterId(Long centerId);
    List<Delivery> findByRecipientId(Long recipientId);
    List<Delivery> findByStatus(DeliveryStatus status);
    Optional<Delivery> findByDonationId(Long donationId);
}