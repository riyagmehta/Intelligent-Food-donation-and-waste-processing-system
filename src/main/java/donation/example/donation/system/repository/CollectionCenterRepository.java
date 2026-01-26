package donation.example.donation.system.repository;

import donation.example.donation.system.model.entity.CollectionCenter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CollectionCenterRepository extends JpaRepository<CollectionCenter, Long> {
    Optional<CollectionCenter> findByUserId(Long userId);
    Optional<CollectionCenter> findByUserUsername(String username);
}
