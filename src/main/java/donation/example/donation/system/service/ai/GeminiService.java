package donation.example.donation.system.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import donation.example.donation.system.dto.ai.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent}")
    private String apiUrl;

    private final PromptService promptService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiService(PromptService promptService) {
        this.promptService = promptService;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Generate a smart donation description based on food items
     */
    public AiResponse generateDescription(List<String> items) {
        try {
            String itemsStr = String.join(", ", items);
            Map<String, String> variables = new HashMap<>();
            variables.put("items", itemsStr);

            String prompt = promptService.fillPrompt("donation-description", variables);
            String response = callGeminiApi(prompt);

            return AiResponse.success(response);
        } catch (Exception e) {
            logger.error("Error generating description: ", e);
            return AiResponse.error("Failed to generate description: " + e.getMessage());
        }
    }

    /**
     * Generate food handling tips based on food items
     */
    public AiResponse getFoodHandlingTips(List<String> items) {
        try {
            String itemsStr = String.join(", ", items);
            Map<String, String> variables = new HashMap<>();
            variables.put("items", itemsStr);

            String prompt = promptService.fillPrompt("food-handling-tips", variables);
            String response = callGeminiApi(prompt);

            return AiResponse.success(response);
        } catch (Exception e) {
            logger.error("Error getting food tips: ", e);
            return AiResponse.error("Failed to get food handling tips: " + e.getMessage());
        }
    }

    /**
     * Generate a personalized thank you message for donors
     */
    public AiResponse generateThankYouMessage(String donorName, List<String> items, String date) {
        try {
            String itemsStr = String.join(", ", items);
            Map<String, String> variables = new HashMap<>();
            variables.put("donorName", donorName);
            variables.put("items", itemsStr);
            variables.put("date", date);

            String prompt = promptService.fillPrompt("thank-you-message", variables);
            String response = callGeminiApi(prompt);

            return AiResponse.success(response);
        } catch (Exception e) {
            logger.error("Error generating thank you message: ", e);
            return AiResponse.error("Failed to generate thank you message: " + e.getMessage());
        }
    }

    /**
     * Call Gemini API with the given prompt
     */
    private String callGeminiApi(String prompt) throws Exception {
        String url = apiUrl + "?key=" + apiKey;

        // Build request body for Gemini API
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, String> part = new HashMap<>();

        part.put("text", prompt);
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));

        // Add generation config
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("maxOutputTokens", 500);
        requestBody.put("generationConfig", generationConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        logger.info("Calling Gemini API with prompt length: {}", prompt.length());

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                String.class
        );

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return extractTextFromResponse(response.getBody());
        } else {
            throw new RuntimeException("Gemini API returned status: " + response.getStatusCode());
        }
    }

    /**
     * Extract the generated text from Gemini API response
     */
    private String extractTextFromResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);

        JsonNode candidates = root.path("candidates");
        if (candidates.isArray() && candidates.size() > 0) {
            JsonNode content = candidates.get(0).path("content");
            JsonNode parts = content.path("parts");
            if (parts.isArray() && parts.size() > 0) {
                return parts.get(0).path("text").asText().trim();
            }
        }

        throw new RuntimeException("Unable to extract text from Gemini response");
    }
}
