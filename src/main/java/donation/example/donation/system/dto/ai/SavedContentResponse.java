package donation.example.donation.system.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavedContentResponse {
    private Long id;
    private Long donationId;
    private String donationName;
    private String content;
    private String contentType;
    private String generatedByUsername;
    private String centerName;
    private LocalDateTime generatedAt;
    private boolean exists;

    public static SavedContentResponse notFound() {
        SavedContentResponse response = new SavedContentResponse();
        response.setExists(false);
        return response;
    }

    public static SavedContentResponse found(Long id, Long donationId, String donationName,
            String content, String contentType, String generatedByUsername,
            String centerName, LocalDateTime generatedAt) {
        SavedContentResponse response = new SavedContentResponse();
        response.setId(id);
        response.setDonationId(donationId);
        response.setDonationName(donationName);
        response.setContent(content);
        response.setContentType(contentType);
        response.setGeneratedByUsername(generatedByUsername);
        response.setCenterName(centerName);
        response.setGeneratedAt(generatedAt);
        response.setExists(true);
        return response;
    }
}
