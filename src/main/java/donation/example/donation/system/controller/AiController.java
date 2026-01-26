package donation.example.donation.system.controller;

import donation.example.donation.system.dto.ai.*;
import donation.example.donation.system.service.ai.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final GeminiService geminiService;

    public AiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    /**
     * Generate a smart donation description based on food items
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
     * Get food handling and storage tips
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
     * Generate a personalized thank you message
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
}
