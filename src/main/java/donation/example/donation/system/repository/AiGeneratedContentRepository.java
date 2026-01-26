package donation.example.donation.system.repository;

import donation.example.donation.system.model.entity.AiGeneratedContent;
import donation.example.donation.system.type.AiContentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AiGeneratedContentRepository extends JpaRepository<AiGeneratedContent, Long> {

    // Find content by donation and type
    Optional<AiGeneratedContent> findByDonationIdAndContentType(Long donationId, AiContentType contentType);

    // Find all content for a donation
    List<AiGeneratedContent> findByDonationId(Long donationId);

    // Find thank you messages for a specific donor (recipient)
    List<AiGeneratedContent> findByRecipientUserIdAndContentTypeOrderByGeneratedAtDesc(
            Long recipientUserId, AiContentType contentType);

    // Find latest thank you messages for a donor
    List<AiGeneratedContent> findTop5ByRecipientUserIdAndContentTypeOrderByGeneratedAtDesc(
            Long recipientUserId, AiContentType contentType);

    // Check if content exists for a donation and type
    boolean existsByDonationIdAndContentType(Long donationId, AiContentType contentType);
}
