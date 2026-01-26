package donation.example.donation.system.dto.ai;

public class FoodTipsResponse {
    private String storageTips;
    private String shelfLife;
    private String spoilageSigns;
    private String handlingTips;
    private String summary;

    public FoodTipsResponse() {}

    public FoodTipsResponse(String storageTips, String shelfLife, String spoilageSigns, String handlingTips, String summary) {
        this.storageTips = storageTips;
        this.shelfLife = shelfLife;
        this.spoilageSigns = spoilageSigns;
        this.handlingTips = handlingTips;
        this.summary = summary;
    }

    public String getStorageTips() {
        return storageTips;
    }

    public void setStorageTips(String storageTips) {
        this.storageTips = storageTips;
    }

    public String getShelfLife() {
        return shelfLife;
    }

    public void setShelfLife(String shelfLife) {
        this.shelfLife = shelfLife;
    }

    public String getSpoilageSigns() {
        return spoilageSigns;
    }

    public void setSpoilageSigns(String spoilageSigns) {
        this.spoilageSigns = spoilageSigns;
    }

    public String getHandlingTips() {
        return handlingTips;
    }

    public void setHandlingTips(String handlingTips) {
        this.handlingTips = handlingTips;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}
