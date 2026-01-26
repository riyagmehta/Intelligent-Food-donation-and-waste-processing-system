package donation.example.donation.system.dto.ai;

import java.util.List;

public class DescriptionRequest {
    private List<String> items;

    public DescriptionRequest() {}

    public DescriptionRequest(List<String> items) {
        this.items = items;
    }

    public List<String> getItems() {
        return items;
    }

    public void setItems(List<String> items) {
        this.items = items;
    }
}
