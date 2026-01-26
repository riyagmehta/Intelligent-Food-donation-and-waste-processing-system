package donation.example.donation.system.controller;

import donation.example.donation.system.dto.ai.*;
import donation.example.donation.system.service.ai.AiContentService;
import donation.example.donation.system.service.ai.GeminiService;
import donation.example.donation.system.type.AiContentType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final GeminiService geminiService;
    private final AiContentService aiContentService;

    public AiController(GeminiService geminiService, AiContentService aiContentService) {
        this.geminiService = geminiService;
        this.aiContentService = aiContentService;
    }

    /**
     * Generate a smart donation description based on food items (not saved)
     * POST /api/ai/generate-description
     */
    @PostMapping("/generate-description")
    public ResponseEntity<AiResponse> generateDescription(@RequestBody DescriptionRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(AiResponse.error("Items list cannot be empty"));
        }

        AiResponse response = geminiService.generateDescription(request.getItems());
        return ResponseEntity.ok(response);
    }

    /**
     * Get food handling and storage tips (legacy - not saved)
     * POST /api/ai/food-tips
     */
    @PostMapping("/food-tips")
    public ResponseEntity<AiResponse> getFoodTips(@RequestBody FoodTipsRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(AiResponse.error("Items list cannot be empty"));
        }

        AiResponse response = geminiService.getFoodHandlingTips(request.getItems());
        return ResponseEntity.ok(response);
    }

    /**
     * Generate and save food tips for a donation
     * POST /api/ai/food-tips/save
     */
    @PostMapping("/food-tips/save")
    public ResponseEntity<AiResponse> generateAndSaveFoodTips(@RequestBody FoodTipsGenerateRequest request) {
        if (request.getDonationId() == null) {
            return ResponseEntity.badRequest().body(AiResponse.error("Donation ID is required"));
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(AiResponse.error("Items list cannot be empty"));
        }

        AiResponse response = aiContentService.generateAndSaveFoodTips(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get saved food tips for a donation
     * GET /api/ai/food-tips/{donationId}
     */
    @GetMapping("/food-tips/{donationId}")
    public ResponseEntity<SavedContentResponse> getSavedFoodTips(@PathVariable Long donationId) {
        SavedContentResponse response = aiContentService.getSavedContent(donationId, AiContentType.FOOD_TIPS);
        return ResponseEntity.ok(response);
    }

    /**
     * Generate a personalized thank you message (legacy - not saved)
     * POST /api/ai/thank-you
     */
    @PostMapping("/thank-you")
    public ResponseEntity<AiResponse> generateThankYou(@RequestBody ThankYouRequest request) {
        if (request.getDonorName() == null || request.getDonorName().isEmpty()) {
            return ResponseEntity.badRequest().body(AiResponse.error("Donor name is required"));
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(AiResponse.error("Items list cannot be empty"));
        }

        String date = request.getDate() != null ? request.getDate() : "today";
        AiResponse response = geminiService.generateThankYouMessage(
                request.getDonorName(),
                request.getItems(),
                date
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Generate and save thank you message - Staff/Admin only
     * POST /api/ai/thank-you/save
     */
    @PostMapping("/thank-you/save")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<AiResponse> generateAndSaveThankYou(@RequestBody ThankYouGenerateRequest request) {
        if (request.getDonationId() == null) {
            return ResponseEntity.badRequest().body(AiResponse.error("Donation ID is required"));
        }
        if (request.getDonorName() == null || request.getDonorName().isEmpty()) {
            return ResponseEntity.badRequest().body(AiResponse.error("Donor name is required"));
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(AiResponse.error("Items list cannot be empty"));
        }

        AiResponse response = aiContentService.generateAndSaveThankYou(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get saved thank you message for a donation
     * GET /api/ai/thank-you/{donationId}
     */
    @GetMapping("/thank-you/{donationId}")
    public ResponseEntity<SavedContentResponse> getSavedThankYou(@PathVariable Long donationId) {
        SavedContentResponse response = aiContentService.getSavedContent(donationId, AiContentType.THANK_YOU);
        return ResponseEntity.ok(response);
    }

    /**
     * Get recent thank you messages for current donor
     * GET /api/ai/thank-you/my
     */
    @GetMapping("/thank-you/my")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<List<SavedContentResponse>> getMyThankYouMessages() {
        List<SavedContentResponse> messages = aiContentService.getMyThankYouMessages();
        return ResponseEntity.ok(messages);
    }

    /**
     * Check if content exists for a donation
     * GET /api/ai/exists/{donationId}/{contentType}
     */
    @GetMapping("/exists/{donationId}/{contentType}")
    public ResponseEntity<Boolean> checkContentExists(
            @PathVariable Long donationId,
            @PathVariable String contentType) {
        try {
            AiContentType type = AiContentType.valueOf(contentType.toUpperCase());
            boolean exists = aiContentService.contentExists(donationId, type);
            return ResponseEntity.ok(exists);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(false);
        }
    }
}
