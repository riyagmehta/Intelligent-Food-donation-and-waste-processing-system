package donation.example.donation.system.repository;


import donation.example.donation.system.model.Donor;
import donation.example.donation.system.model.DonorType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {
    List<Donor> findByType(DonorType type);
}
