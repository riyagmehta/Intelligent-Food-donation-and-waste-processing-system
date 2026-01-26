package donation.example.donation.system.service.ai;

import donation.example.donation.system.dto.ai.*;
import donation.example.donation.system.model.entity.AiGeneratedContent;
import donation.example.donation.system.model.entity.Donation;
import donation.example.donation.system.model.entity.User;
import donation.example.donation.system.repository.AiGeneratedContentRepository;
import donation.example.donation.system.repository.DonationRepository;
import donation.example.donation.system.repository.UserRepository;
import donation.example.donation.system.type.AiContentType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AiContentService {

    private static final Logger logger = LoggerFactory.getLogger(AiContentService.class);

    private final AiGeneratedContentRepository aiContentRepository;
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

    public AiContentService(AiGeneratedContentRepository aiContentRepository,
                           DonationRepository donationRepository,
                           UserRepository userRepository,
                           GeminiService geminiService) {
        this.aiContentRepository = aiContentRepository;
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
        this.geminiService = geminiService;
    }

    /**
     * Get current logged-in user
     */
    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Generate and save thank you message (Staff only)
     */
    @Transactional
    public AiResponse generateAndSaveThankYou(ThankYouGenerateRequest request) {
        try {
            User currentUser = getCurrentUser();

            // Get donation details
            Donation donation = donationRepository.findById(request.getDonationId())
                    .orElseThrow(() -> new RuntimeException("Donation not found"));

            // Get donor user ID
            Long donorUserId = donation.getDonor().getUser().getId();

            // Check if thank you already exists
            Optional<AiGeneratedContent> existing = aiContentRepository
                    .findByDonationIdAndContentType(request.getDonationId(), AiContentType.THANK_YOU);

            if (existing.isPresent()) {
                // Return existing content
                AiGeneratedContent content = existing.get();
                return AiResponse.success(content.getContent());
            }

            // Generate new thank you message
            AiResponse aiResponse = geminiService.generateThankYouMessage(
                    request.getDonorName(),
                    request.getItems(),
                    request.getDate() != null ? request.getDate() : "today"
            );

            if (!aiResponse.isSuccess()) {
                return aiResponse;
            }

            // Save to database
            AiGeneratedContent content = new AiGeneratedContent();
            content.setDonationId(request.getDonationId());
            content.setContentType(AiContentType.THANK_YOU);
            content.setContent(aiResponse.getContent());
            content.setRecipientUserId(donorUserId);
            content.setGeneratedByUserId(currentUser.getId());
            content.setGeneratedByUsername(currentUser.getUsername());
            content.setDonationName(donation.getName());
            content.setGeneratedAt(LocalDateTime.now());

            // Get center name if available
            if (donation.getCollectionCenter() != null) {
                content.setCenterName(donation.getCollectionCenter().getName());
            }

            aiContentRepository.save(content);

            logger.info("Thank you message generated and saved for donation: {}", request.getDonationId());

            return aiResponse;
        } catch (Exception e) {
            logger.error("Error generating thank you message: ", e);
            return AiResponse.error("Failed to generate thank you message: " + e.getMessage());
        }
    }

    /**
     * Generate and save food tips
     */
    @Transactional
    public AiResponse generateAndSaveFoodTips(FoodTipsGenerateRequest request) {
        try {
            User currentUser = getCurrentUser();

            // Check if tips already exist
            Optional<AiGeneratedContent> existing = aiContentRepository
                    .findByDonationIdAndContentType(request.getDonationId(), AiContentType.FOOD_TIPS);

            if (existing.isPresent()) {
                // Return existing content
                return AiResponse.success(existing.get().getContent());
            }

            // Get donation details
            Donation donation = donationRepository.findById(request.getDonationId())
                    .orElseThrow(() -> new RuntimeException("Donation not found"));

            // Generate new tips
            AiResponse aiResponse = geminiService.getFoodHandlingTips(request.getItems());

            if (!aiResponse.isSuccess()) {
                return aiResponse;
            }

            // Save to database
            AiGeneratedContent content = new AiGeneratedContent();
            content.setDonationId(request.getDonationId());
            content.setContentType(AiContentType.FOOD_TIPS);
            content.setContent(aiResponse.getContent());
            content.setGeneratedByUserId(currentUser.getId());
            content.setGeneratedByUsername(currentUser.getUsername());
            content.setDonationName(donation.getName());
            content.setGeneratedAt(LocalDateTime.now());

            aiContentRepository.save(content);

            logger.info("Food tips generated and saved for donation: {}", request.getDonationId());

            return aiResponse;
        } catch (Exception e) {
            logger.error("Error generating food tips: ", e);
            return AiResponse.error("Failed to generate food tips: " + e.getMessage());
        }
    }

    /**
     * Get saved content for a donation
     */
    public SavedContentResponse getSavedContent(Long donationId, AiContentType contentType) {
        Optional<AiGeneratedContent> content = aiContentRepository
                .findByDonationIdAndContentType(donationId, contentType);

        if (content.isPresent()) {
            AiGeneratedContent c = content.get();
            return SavedContentResponse.found(
                    c.getId(),
                    c.getDonationId(),
                    c.getDonationName(),
                    c.getContent(),
                    c.getContentType().name(),
                    c.getGeneratedByUsername(),
                    c.getCenterName(),
                    c.getGeneratedAt()
            );
        }

        return SavedContentResponse.notFound();
    }

    /**
     * Get recent thank you messages for current donor
     */
    public List<SavedContentResponse> getMyThankYouMessages() {
        User currentUser = getCurrentUser();

        List<AiGeneratedContent> messages = aiContentRepository
                .findTop5ByRecipientUserIdAndContentTypeOrderByGeneratedAtDesc(
                        currentUser.getId(), AiContentType.THANK_YOU);

        return messages.stream()
                .map(c -> SavedContentResponse.found(
                        c.getId(),
                        c.getDonationId(),
                        c.getDonationName(),
                        c.getContent(),
                        c.getContentType().name(),
                        c.getGeneratedByUsername(),
                        c.getCenterName(),
                        c.getGeneratedAt()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Check if content exists for a donation
     */
    public boolean contentExists(Long donationId, AiContentType contentType) {
        return aiContentRepository.existsByDonationIdAndContentType(donationId, contentType);
    }
}
