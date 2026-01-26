package donation.example.donation.system.repository;

import donation.example.donation.system.model.entity.Recipient;
import donation.example.donation.system.type.RecipientType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipientRepository extends JpaRepository<Recipient, Long> {
    List<Recipient> findByType(RecipientType type);
    List<Recipient> findByIsActiveTrue();
}
