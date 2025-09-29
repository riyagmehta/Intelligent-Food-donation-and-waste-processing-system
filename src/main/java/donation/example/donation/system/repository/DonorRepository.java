package donation.example.donation.system.repository;

import donation.example.donation.system.model.Donor;
import donation.example.donation.system.model.DonationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {
    @Query("SELECT DISTINCT d FROM Donor d JOIN d.donations donation WHERE donation.donationType = :type")
    List<Donor> findByDonationType(@Param("type") DonationType type);
}
