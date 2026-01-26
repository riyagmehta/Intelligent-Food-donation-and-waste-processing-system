package donation.example.donation.system.dto.ai;

import java.util.List;

public class ThankYouRequest {
    private String donorName;
    private List<String> items;
    private String date;

    public ThankYouRequest() {}

    public ThankYouRequest(String donorName, List<String> items, String date) {
        this.donorName = donorName;
        this.items = items;
        this.date = date;
    }

    public String getDonorName() {
        return donorName;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public List<String> getItems() {
        return items;
    }

    public void setItems(List<String> items) {
        this.items = items;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
