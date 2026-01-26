package donation.example.donation.system.dto.ai;

import java.util.List;

public class FoodTipsRequest {
    private List<String> items;

    public FoodTipsRequest() {}

    public FoodTipsRequest(List<String> items) {
        this.items = items;
    }

    public List<String> getItems() {
        return items;
    }

    public void setItems(List<String> items) {
        this.items = items;
    }
}
