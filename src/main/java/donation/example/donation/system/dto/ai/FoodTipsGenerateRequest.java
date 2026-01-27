package donation.example.donation.system.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodTipsGenerateRequest {
    private Long donationId;
    private List<String> items;
}
