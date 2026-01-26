package donation.example.donation.system.dto.ai;

public class AiResponse {
    private String content;
    private boolean success;
    private String error;

    public AiResponse() {}

    public AiResponse(String content, boolean success) {
        this.content = content;
        this.success = success;
    }

    public AiResponse(String content, boolean success, String error) {
        this.content = content;
        this.success = success;
        this.error = error;
    }

    public static AiResponse success(String content) {
        return new AiResponse(content, true);
    }

    public static AiResponse error(String error) {
        return new AiResponse(null, false, error);
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
