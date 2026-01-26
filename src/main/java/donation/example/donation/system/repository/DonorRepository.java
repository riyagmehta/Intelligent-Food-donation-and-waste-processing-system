package donation.example.donation.system.repository;

import donation.example.donation.system.model.entity.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {
    Optional<Donor> findByUserUsername(String username);
    Optional<Donor> findByUserId(Long userId);
}
