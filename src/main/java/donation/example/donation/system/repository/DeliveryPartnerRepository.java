package donation.example.donation.system.repository;

import donation.example.donation.system.model.entity.DeliveryPartner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryPartnerRepository extends JpaRepository<DeliveryPartner, Long> {
    Optional<DeliveryPartner> findByUserUsername(String username);
    List<DeliveryPartner> findByCollectionCenterId(Long centerId);
    List<DeliveryPartner> findByIsAvailableTrue();
    List<DeliveryPartner> findByCollectionCenterIdAndIsAvailableTrue(Long centerId);
}
