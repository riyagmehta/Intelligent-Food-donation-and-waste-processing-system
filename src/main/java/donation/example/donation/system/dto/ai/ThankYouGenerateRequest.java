package donation.example.donation.system.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThankYouGenerateRequest {
    private Long donationId;
    private String donorName;
    private List<String> items;
    private String date;
}
